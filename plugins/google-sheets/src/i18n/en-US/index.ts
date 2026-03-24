import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Google Sheets",
  PLUGIN_DESCRIPTION: "Read, write, and manage Google Sheets spreadsheets.",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Google Sheets OAuth 2.0",
  CREDENTIAL_DESCRIPTION: "OAuth 2.0 credential for Google Sheets API access.",
  CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "Client ID",
  CREDENTIAL_CLIENT_ID_HINT:
    "Create OAuth 2.0 credentials at https://console.cloud.google.com",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER: "OAuth 2.0 Client ID from Google Cloud",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "Create OAuth 2.0 credentials at https://console.cloud.google.com",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER:
    "OAuth 2.0 Client Secret from Google Cloud",

  // Common parameters
  PARAM_CREDENTIAL_LABEL: "Credential",
  PARAM_SPREADSHEET_ID_LABEL: "Spreadsheet ID",
  PARAM_SPREADSHEET_ID_HINT:
    "The ID of the Google Sheets spreadsheet (found in the URL).",
  PARAM_SPREADSHEET_ID_PLACEHOLDER:
    "e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  PARAM_RANGE_LABEL: "Range",
  PARAM_RANGE_HINT: "The A1 notation of the range (e.g. Sheet1!A1:D10).",
  PARAM_RANGE_PLACEHOLDER: "e.g. Sheet1!A1:D10",
  PARAM_MAJOR_DIMENSION_LABEL: "Major Dimension",
  PARAM_VALUE_RENDER_OPTION_LABEL: "Value Render Option",
  PARAM_VALUE_INPUT_OPTION_LABEL: "Value Input Option",
  PARAM_VALUE_INPUT_OPTION_HINT:
    "RAW: values are stored as-is. USER_ENTERED: values are parsed as if typed by a user.",
  PARAM_VALUES_LABEL: "Values",
  PARAM_VALUES_HINT:
    'A 2D JSON array of values. e.g. [["Name","Age"],["Alice",30]]',
  PARAM_VALUES_PLACEHOLDER: '[[\"value1\",\"value2\"],[\"value3\",\"value4\"]]',

  // Read Rows
  READ_ROWS_TOOL_DISPLAY_NAME: "Read Rows",
  READ_ROWS_TOOL_DESCRIPTION:
    "Read values from a specified range in a Google Sheets spreadsheet.",

  // Update Rows
  UPDATE_ROWS_TOOL_DISPLAY_NAME: "Update Rows",
  UPDATE_ROWS_TOOL_DESCRIPTION:
    "Write values to a specified range in a Google Sheets spreadsheet.",

  // Append Rows
  APPEND_ROWS_TOOL_DISPLAY_NAME: "Append Rows",
  APPEND_ROWS_TOOL_DESCRIPTION:
    "Append rows of data after the last row of a table in a Google Sheets spreadsheet.",
  PARAM_APPEND_RANGE_HINT:
    "The range to search for a table boundary, after which values will be appended.",
  PARAM_APPEND_RANGE_PLACEHOLDER: "e.g. Sheet1!A:D",
  PARAM_INSERT_DATA_OPTION_LABEL: "Insert Data Option",
  PARAM_INSERT_DATA_OPTION_HINT:
    "INSERT_ROWS: inserts new rows. OVERWRITE: overwrites existing data.",
  PARAM_APPEND_VALUES_HINT:
    'A 2D JSON array of rows to append. e.g. [["Alice",30],["Bob",25]]',

  // Clear Values
  CLEAR_VALUES_TOOL_DISPLAY_NAME: "Clear Values",
  CLEAR_VALUES_TOOL_DESCRIPTION:
    "Clear all values from a specified range in a Google Sheets spreadsheet.",

  // Create Spreadsheet
  CREATE_SPREADSHEET_TOOL_DISPLAY_NAME: "Create Spreadsheet",
  CREATE_SPREADSHEET_TOOL_DESCRIPTION:
    "Create a new Google Sheets spreadsheet.",
  PARAM_TITLE_LABEL: "Title",
  PARAM_TITLE_HINT: "The title of the new spreadsheet.",
  PARAM_TITLE_PLACEHOLDER: "e.g. My New Spreadsheet",
  PARAM_SHEET_TITLES_LABEL: "Sheet Names (optional)",
  PARAM_SHEET_TITLES_HINT:
    "Comma-separated list of sheet names. Leave empty for a single default sheet.",
  PARAM_SHEET_TITLES_PLACEHOLDER: "e.g. Sheet1, Sheet2, Data",

  // Get Spreadsheet Info
  GET_SPREADSHEET_INFO_TOOL_DISPLAY_NAME: "Get Spreadsheet Info",
  GET_SPREADSHEET_INFO_TOOL_DESCRIPTION:
    "Get metadata and properties of a Google Sheets spreadsheet.",
  PARAM_INCLUDE_GRID_DATA_LABEL: "Include Grid Data",
  PARAM_INCLUDE_GRID_DATA_HINT:
    "Whether to include the full grid data (cell values) in the response.",

  // Copy Sheet
  COPY_SHEET_TOOL_DISPLAY_NAME: "Copy Sheet",
  COPY_SHEET_TOOL_DESCRIPTION:
    "Copy a single sheet from one spreadsheet to another.",
  PARAM_SHEET_ID_LABEL: "Sheet ID",
  PARAM_SHEET_ID_HINT:
    "The numeric ID of the sheet to copy (found in the sheet URL as gid=xxx).",
  PARAM_SOURCE_SPREADSHEET_ID_HINT:
    "The ID of the source spreadsheet containing the sheet to copy.",
  PARAM_DESTINATION_SPREADSHEET_ID_LABEL: "Destination Spreadsheet ID",
  PARAM_DESTINATION_SPREADSHEET_ID_HINT:
    "The ID of the target spreadsheet to copy the sheet to.",

  // Batch Get Values
  BATCH_GET_VALUES_TOOL_DISPLAY_NAME: "Batch Get Values",
  BATCH_GET_VALUES_TOOL_DESCRIPTION:
    "Read values from multiple ranges in a Google Sheets spreadsheet at once.",
  PARAM_RANGES_LABEL: "Ranges",
  PARAM_RANGES_HINT:
    "Comma-separated A1 notation ranges. e.g. Sheet1!A1:B2, Sheet2!C1:D5",
  PARAM_RANGES_PLACEHOLDER: "e.g. Sheet1!A1:B10, Sheet2!A1:C5",
} satisfies BaseTranslation

export default en_US
