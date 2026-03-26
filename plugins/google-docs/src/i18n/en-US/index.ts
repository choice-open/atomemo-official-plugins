import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Testing Plugin",
  PLUGIN_DESCRIPTION: "A plugin for testing the plugin",
  DEMO_TOOL_DISPLAY_NAME: "Demo Tool",
  DEMO_TOOL_DESCRIPTION: "A tool for testing the plugin",
  LOCATION_DISPLAY_NAME: "Location",
  LOCATION_HINT: "The location to test",
  LOCATION_PLACEHOLDER: "Enter the location to test",
  GOOGLE_DOCS_CREDENTIAL_DISPLAY_NAME: "Google Docs OAuth2",
  GOOGLE_DOCS_CREDENTIAL_DESCRIPTION:
    "OAuth2 credentials for accessing Google Docs API",
  CLIENT_ID_DISPLAY_NAME: "Client ID",
  CLIENT_ID_PLACEHOLDER: "Google OAuth2 Client ID",
  CLIENT_ID_HINT: "Create OAuth2 credentials in Google Cloud Console",
  CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CLIENT_SECRET_HINT: "Google OAuth2 Client Secret",
  GOOGLE_DOCS_CREDENTIAL_PARAM_DISPLAY_NAME: "Google Credential",
  CREATE_DOCUMENT_TOOL_DISPLAY_NAME: "Create Document",
  CREATE_DOCUMENT_TOOL_DESCRIPTION: "Create a new Google Docs document",
  GET_DOCUMENT_TOOL_DISPLAY_NAME: "Get Document",
  GET_DOCUMENT_TOOL_DESCRIPTION: "Get Google Docs document content by ID",
  BATCH_UPDATE_DOCUMENT_TOOL_DISPLAY_NAME: "Batch Update Document",
  BATCH_UPDATE_DOCUMENT_TOOL_DESCRIPTION:
    "Apply batchUpdate requests to a Google Docs document",
  DOCUMENT_TITLE_DISPLAY_NAME: "Document Title",
  DOCUMENT_TITLE_PLACEHOLDER: "Enter document title",
  DOCUMENT_TITLE_HINT: "Title for the new Google Docs document",
  DOCUMENT_ID_DISPLAY_NAME: "Document ID",
  DOCUMENT_ID_PLACEHOLDER: "Enter Google Docs document ID",
  DOCUMENT_ID_HINT: "Document ID from docs.google.com URL",
  INCLUDE_TABS_CONTENT_DISPLAY_NAME: "Include Tabs Content",
  INCLUDE_TABS_CONTENT_HINT:
    "When enabled, return content in tabs field for multi-tab docs",
  REQUESTS_JSON_DISPLAY_NAME: "Requests JSON",
  REQUESTS_JSON_HINT:
    "JSON array of Google Docs Request objects used in batchUpdate",
  REQUESTS_JSON_PLACEHOLDER: "JSON array for batchUpdate requests",
  BATCH_OPERATION_DISPLAY_NAME: "Operation",
  BATCH_OPERATION_HINT: "Choose structured mode or raw JSON mode",
  INSERT_TEXT_DISPLAY_NAME: "Insert Text",
  INSERT_TEXT_HINT: "Text to insert when operation is insert_text",
  INSERT_INDEX_DISPLAY_NAME: "Insert Index",
  INSERT_INDEX_HINT: "Character index where text insertion starts",
  REPLACE_CONTAINS_TEXT_DISPLAY_NAME: "Match Text",
  REPLACE_CONTAINS_TEXT_HINT:
    "Text to search when operation is replace_all_text",
  REPLACE_TEXT_DISPLAY_NAME: "Replace Text",
  REPLACE_TEXT_HINT: "Replacement text for replace_all_text",
  STYLE_START_INDEX_DISPLAY_NAME: "Style Start Index",
  STYLE_START_INDEX_HINT: "Start index for style update range",
  STYLE_END_INDEX_DISPLAY_NAME: "Style End Index",
  STYLE_END_INDEX_HINT: "End index for style update range",
  STYLE_BOLD_DISPLAY_NAME: "Set Bold",
  STYLE_BOLD_HINT: "Whether to apply bold style in update_text_style",
  WRITE_CONTROL_JSON_DISPLAY_NAME: "Write Control JSON",
  WRITE_CONTROL_JSON_HINT:
    "Optional JSON object with revision control settings",
  WRITE_CONTROL_JSON_PLACEHOLDER: "JSON object for write control",
} satisfies BaseTranslation

export default en_US
