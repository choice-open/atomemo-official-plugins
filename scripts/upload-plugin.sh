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

# Upload to S3
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-plugins/}"

if [ -z "$S3_BUCKET" ]; then
	echo "Error: S3_BUCKET environment variable is not set"
	exit 1
fi

S3_PATH="s3://${S3_BUCKET}/${S3_PREFIX}${TARGET_DIR#${PLUGINS_DIR}/}"

echo "Uploading ${TARGET_DIR} to ${S3_PATH}"

aws s3 sync "${TARGET_DIR}" "${S3_PATH}" --delete

echo "Upload completed successfully"
