import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Google Drive",
  PLUGIN_DESCRIPTION: "Access data on Google Drive.",

  CREDENTIAL_DISPLAY_NAME: "Google Drive OAuth 2.0 (Refresh Token)",
  CREDENTIAL_DESCRIPTION:
    "OAuth 2.0 credential for Google Drive using a refresh token (client ID/secret + refresh token).",
  CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "Client ID",
  CREDENTIAL_CLIENT_ID_HINT:
    "Create OAuth 2.0 credentials at https://console.cloud.google.com",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER: "Enter your client ID",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER_OAUTH:
    "OAuth 2.0 Client ID from Google Cloud",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "Create OAuth 2.0 credentials at https://console.cloud.google.com",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER: "Enter your client secret",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER_OAUTH:
    "OAuth 2.0 Client Secret from Google Cloud",
  CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME: "Refresh Token",
  CREDENTIAL_REFRESH_TOKEN_HINT:
    "A Google OAuth refresh token with Google Drive scopes.",
  CREDENTIAL_REFRESH_TOKEN_PLACEHOLDER: "Enter your refresh token",

  UPLOAD_FILE_TOOL_DISPLAY_NAME: "Upload File",
  UPLOAD_FILE_TOOL_DESCRIPTION: "Upload an existing file to Google Drive.",

  PARAM_FILE_URL_LABEL: "File URL",
  PARAM_FILE_URL_HINT: "If provided, the file at this URL will be uploaded.",
  PARAM_FILE_URL_PLACEHOLDER: "https://example.com/path/to/file.ext",

  DOWNLOAD_FILE_TOOL_DISPLAY_NAME: "Download File",
  DOWNLOAD_FILE_TOOL_DESCRIPTION: "Download a file from Google Drive.",
  DOWNLOAD_FILE_PARAM_FILE_ID_LABEL: "File ID",
  DOWNLOAD_FILE_PARAM_FILE_ID_HINT: "The Google Drive file ID",
  DOWNLOAD_FILE_PARAM_FILE_ID_PLACEHOLDER:
    "e.g. 1yfPKl0o0f9oVUBc-r-g5vPaom9qS5QdR",
  DOWNLOAD_FILE_PARAM_TEMP_URL_LABEL: "Temporary URL",

  PARAM_CREDENTIAL_LABEL: "Credential",
  PARAM_FILE_LABEL: "File",
  PARAM_FILE_NAME_LABEL: "File Name",
  PARAM_FILE_NAME_HINT:
    "If not specified, the original file name will be used.",
  PARAM_FILE_NAME_PLACEHOLDER: "e.g. My New File",
  PARAM_DRIVE_ID_LABEL: "Parent Drive (optional)",
  PARAM_DRIVE_ID_HINT: "The drive where to upload the file.",
  PARAM_DRIVE_ID_PLACEHOLDER: "0AxxxxxxxxxxxxxxxxxPVA",
  PARAM_FOLDER_ID_LABEL: "Parent Folder (optional)",
  PARAM_FOLDER_ID_HINT:
    "The folder where to upload the file (takes precedence).",
  PARAM_FOLDER_ID_PLACEHOLDER: "1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
} satisfies BaseTranslation

export default en_US
