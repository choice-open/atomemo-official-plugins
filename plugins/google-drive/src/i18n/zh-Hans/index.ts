import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "Google Drive",
  PLUGIN_DESCRIPTION: "访问 Google 云端硬盘上的数据。",

  CREDENTIAL_DISPLAY_NAME: "Google Drive OAuth 2.0（刷新令牌）",
  CREDENTIAL_DESCRIPTION:
    "用于 Google Drive 的 OAuth 2.0 凭证：Client ID/Secret + Refresh Token。",
  CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "客户端 ID",
  CREDENTIAL_CLIENT_ID_HINT:
    "在 https://console.cloud.google.com 创建 OAuth 2.0 凭据。",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER: "输入你的 client ID",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER_OAUTH:
    "来自 Google Cloud 的 OAuth 2.0 客户端 ID",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "客户端密钥",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "在 https://console.cloud.google.com 创建 OAuth 2.0 凭据。",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER: "输入你的 client secret",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER_OAUTH:
    "来自 Google Cloud 的 OAuth 2.0 客户端密钥",
  CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME: "Refresh Token",
  CREDENTIAL_REFRESH_TOKEN_HINT:
    "包含 Google Drive 相关权限的 OAuth 刷新令牌。",
  CREDENTIAL_REFRESH_TOKEN_PLACEHOLDER: "输入你的 refresh token",

  UPLOAD_FILE_TOOL_DISPLAY_NAME: "上传文件",
  UPLOAD_FILE_TOOL_DESCRIPTION: "将现有文件上传到 Google Drive。",

  PARAM_FILE_URL_LABEL: "文件 URL",
  PARAM_FILE_URL_HINT: "如果提供，将上传此 URL 指向的文件。",
  PARAM_FILE_URL_PLACEHOLDER: "https://example.com/path/to/file.ext",

  DOWNLOAD_FILE_TOOL_DISPLAY_NAME: "下载文件",
  DOWNLOAD_FILE_TOOL_DESCRIPTION: "从 Google Drive 下载文件。",
  DOWNLOAD_FILE_PARAM_FILE_ID_LABEL: "文件 ID",
  DOWNLOAD_FILE_PARAM_FILE_ID_HINT: "Google Drive 文件 ID",
  DOWNLOAD_FILE_PARAM_FILE_ID_PLACEHOLDER:
    "例如：1yfPKl0o0f9oVUBc-r-g5vPaom9qS5QdR",
  DOWNLOAD_FILE_PARAM_FILE_ID_MODE_LIST_PLACEHOLDER: "搜索文件...",
  DOWNLOAD_FILE_PARAM_FILE_ID_MODE_URL_PLACEHOLDER:
    "https://drive.google.com/file/d/1yfPKl0o0f9oVUBc-r-g5vPaom9qS5QdR/edit",
  DOWNLOAD_FILE_PARAM_TEMP_URL_LABEL: "临时链接",

  PARAM_CREDENTIAL_LABEL: "凭证",
  PARAM_FILE_LABEL: "文件",
  PARAM_FILE_NAME_LABEL: "文件名",
  PARAM_FILE_NAME_HINT: "如果未指定，将使用原始文件名。",
  PARAM_FILE_NAME_PLACEHOLDER: "例如：我的新文件",
  PARAM_DRIVE_ID_LABEL: "父级云端硬盘（可选）",
  PARAM_DRIVE_ID_HINT: "要将文件上传到的云端硬盘。",
  PARAM_DRIVE_ID_PLACEHOLDER: "0AxxxxxxxxxxxxxxxxxPVA",
  PARAM_FOLDER_ID_LABEL: "父级文件夹（可选）",
  PARAM_FOLDER_ID_HINT: "要将文件上传到的文件夹（优先级更高）。",
  PARAM_FOLDER_ID_PLACEHOLDER: "1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  PARAM_FOLDER_ID_MODE_LIST_PLACEHOLDER: "搜索文件夹...",
  PARAM_FOLDER_ID_MODE_URL_PLACEHOLDER:
    "https://drive.google.com/drive/folders/1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
} satisfies Translation

export default zh_Hans
