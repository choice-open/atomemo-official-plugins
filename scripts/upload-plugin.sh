#!/bin/bash
set -euo pipefail

BASE_SHA="$1"
HEAD_SHA="$2"
PLUGINS_DIR="plugins"

# Get changed files in plugins directory
CHANGED_FILES=$(git diff --name-only --diff-filter=ACDMR "${BASE_SHA}" "${HEAD_SHA}" | grep "^${PLUGINS_DIR}/" || true)

if [ -z "$CHANGED_FILES" ]; then
	echo "No files changed in ${PLUGINS_DIR}/ directory"
	exit 0
fi

# Extract unique directories from changed files
# Only consider files in subdirectories (at least 2 levels deep)
DIRECTORIES=$(echo "$CHANGED_FILES" | sed "s|^${PLUGINS_DIR}/||" | grep "/" | cut -d'/' -f1 | sort -u)

if [ -z "$DIRECTORIES" ]; then
	echo "Error: Changed files must be in a plugin subdirectory (e.g., plugins/plugin-name/...)"
	echo "Files in plugins/ root directory are not allowed"
	exit 1
fi

# Count unique directories
DIR_COUNT=$(echo "$DIRECTORIES" | wc -l | tr -d ' ')

if [ "$DIR_COUNT" -gt 1 ]; then
	echo "Error: PR involves multiple plugin directories:"
	# shellcheck disable=SC2001
	echo "$DIRECTORIES" | sed 's/^/  - /'
	exit 1
fi

TARGET_DIR="${PLUGINS_DIR}/$(echo "$DIRECTORIES" | head -n1)"

# Verify target directory exists
if [ ! -d "$TARGET_DIR" ]; then
	echo "Error: Target directory '$TARGET_DIR' does not exist"
	exit 1
fi

# Verify all changed files are within the target directory
while IFS= read -r file; do
	if [[ ! "$file" =~ ^${TARGET_DIR}/ ]]; then
		echo "Error: File '$file' is outside target directory '$TARGET_DIR'"
		exit 1
	fi
done <<<"$CHANGED_FILES"

echo "Target directory: ${TARGET_DIR}"

# Function to extract version from project files
extract_version() {
	local dir="$1"
	local sha="$2"

	# Try npm project (package.json)
	if git show "${sha}:${dir}/package.json" &>/dev/null; then
		git show "${sha}:${dir}/package.json" | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1
	# Try elixir project (mix.exs)
	elif git show "${sha}:${dir}/mix.exs" &>/dev/null; then
		git show "${sha}:${dir}/mix.exs" | sed -n 's/.*version:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1
	else
		echo ""
	fi
}

# Extract versions from both base and head
BASE_VERSION=$(extract_version "$TARGET_DIR" "$BASE_SHA")
HEAD_VERSION=$(extract_version "$TARGET_DIR" "$HEAD_SHA")

if [ -z "$HEAD_VERSION" ]; then
	echo "Error: Cannot find version in package.json or mix.exs in $TARGET_DIR"
	exit 1
fi

echo "Base version: ${BASE_VERSION:-<none>}"
echo "Head version: ${HEAD_VERSION}"

# Check if version was updated in this PR
if [ -n "$BASE_VERSION" ] && [ "$BASE_VERSION" = "$HEAD_VERSION" ]; then
	echo "Error: Version not updated in this PR"
	echo "Current version: $HEAD_VERSION"
	exit 1
fi

# Create compressed archive
PLUGIN_NAME="${TARGET_DIR#"${PLUGINS_DIR}/"}"
ARCHIVE_NAME="${PLUGIN_NAME}_${HEAD_VERSION}.tar.gz"
TEMP_ARCHIVE="/tmp/${ARCHIVE_NAME}"
VERSIONED_NAME="${PLUGIN_NAME}_${HEAD_VERSION}"

echo "Creating compressed archive: ${ARCHIVE_NAME}"
ln -s "${PLUGIN_NAME}" "${PLUGINS_DIR}/${VERSIONED_NAME}"
tar -czf "${TEMP_ARCHIVE}" -C "${PLUGINS_DIR}" -h "${VERSIONED_NAME}"
rm "${PLUGINS_DIR}/${VERSIONED_NAME}"

# Upload to S3
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-plugins/}"

if [ -z "$S3_BUCKET" ]; then
	echo "Error: S3_BUCKET environment variable is not set"
	exit 1
fi

S3_PATH="s3://${S3_BUCKET}/${S3_PREFIX}${ARCHIVE_NAME}"

echo "Uploading ${ARCHIVE_NAME} to ${S3_PATH}"

aws s3 cp "${TEMP_ARCHIVE}" "${S3_PATH}"

# Clean up temporary archive
rm -f "${TEMP_ARCHIVE}"

echo "Upload completed successfully"

# Release plugin via API
STAGING_HUB_API_URL="${STAGING_HUB_API_URL:-}"
STAGING_RELEASE_API_KEY="${STAGING_RELEASE_API_KEY:-}"
PRODUCTION_HUB_API_URL="${PRODUCTION_HUB_API_URL:-}"
PRODUCTION_RELEASE_API_KEY="${PRODUCTION_RELEASE_API_KEY:-}"

if [ -z "$STAGING_HUB_API_URL" ]; then
	echo "Warning: STAGING_HUB_API_URL is not set, skipping release API call"
	exit 0
fi

if [ -z "$STAGING_RELEASE_API_KEY" ]; then
	echo "Warning: STAGING_RELEASE_API_KEY is not set, skipping release API call"
	exit 0
fi

if [ -z "$PRODUCTION_HUB_API_URL" ]; then
	echo "Warning: PRODUCTION_HUB_API_URL is not set, skipping release API call"
	exit 0
fi

if [ -z "$PRODUCTION_RELEASE_API_KEY" ]; then
	echo "Warning: PRODUCTION_RELEASE_API_KEY is not set, skipping release API call"
	exit 0
fi

DEFINITION_FILE="${TARGET_DIR}/definition.json"

if [ ! -f "$DEFINITION_FILE" ]; then
	echo "Error: definition.json not found in ${TARGET_DIR}"
	exit 1
fi

echo "Releasing plugin on staging environment via API..."

STAGING_RELEASE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
	"${STAGING_HUB_API_URL}/api/v1/release/plugins" \
	-H "Content-Type: application/json" \
	-H "x-api-key: ${STAGING_RELEASE_API_KEY}" \
	-d @"${DEFINITION_FILE}")

STAGING_HTTP_CODE=$(echo "$STAGING_RELEASE_RESPONSE" | tail -n1)
STAGING_RESPONSE_BODY=$(echo "$STAGING_RELEASE_RESPONSE" | sed '$d')

if [ "$STAGING_HTTP_CODE" -ge 200 ] && [ "$STAGING_HTTP_CODE" -lt 300 ]; then
	echo "Plugin released on staging environment successfully"
	echo "Response: ${STAGING_RESPONSE_BODY}"
else
	echo "Error: Failed to release plugin on staging environment (HTTP ${STAGING_HTTP_CODE})"
	echo "Response: ${STAGING_RESPONSE_BODY}"
	exit 1
fi

echo "Releasing plugin on production environment via API..."

PRODUCTION_RELEASE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
	"${PRODUCTION_HUB_API_URL}/api/v1/release/plugins" \
	-H "Content-Type: application/json" \
	-H "x-api-key: ${PRODUCTION_RELEASE_API_KEY}" \
	-d @"${DEFINITION_FILE}")

PRODUCTION_HTTP_CODE=$(echo "$PRODUCTION_RELEASE_RESPONSE" | tail -n1)
PRODUCTION_RESPONSE_BODY=$(echo "$PRODUCTION_RELEASE_RESPONSE" | sed '$d')

if [ "$PRODUCTION_HTTP_CODE" -ge 200 ] && [ "$PRODUCTION_HTTP_CODE" -lt 300 ]; then
	echo "Plugin released on production environment successfully"
	echo "Response: ${PRODUCTION_RESPONSE_BODY}"
else
	echo "Error: Failed to release plugin on production environment (HTTP ${PRODUCTION_HTTP_CODE})"
	echo "Response: ${PRODUCTION_RESPONSE_BODY}"
	exit 1
fi
