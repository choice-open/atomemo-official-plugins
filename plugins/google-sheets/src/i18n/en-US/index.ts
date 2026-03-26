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
    "Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID. Use a Desktop or Web client; enable the Google Sheets API for the project; add the redirect URI your Atomemo / plugin flow shows. The Client ID looks like digits followed by .apps.googleusercontent.com.",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER:
    "e.g. 123456789-abc.apps.googleusercontent.com",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "Issued together with the Client ID for the same OAuth client. Treat it like a password — never commit it to public repos. If rotated, update this field and re-authorize if prompted.",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER: "e.g. GOCSPX-xxxxxxxxxxxx",

  // Common parameters
  PARAM_CREDENTIAL_LABEL: "Credential",
  PARAM_SPREADSHEET_ID_LABEL: "Spreadsheet ID",
  PARAM_SPREADSHEET_ID_HINT:
    "Open the spreadsheet in the browser. Copy the long segment between /d/ and /edit (or /edit#gid=…) in the URL — that is the spreadsheet ID. Example: https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit",
  PARAM_SPREADSHEET_ID_PLACEHOLDER:
    "e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  PARAM_RANGE_LABEL: "Range",
  PARAM_RANGE_HINT:
    "A1 notation: optional sheet name, then !, then cells. Examples: Sheet1!A1:D10 (rectangle), Sheet1!A2:A (one column from row 2), Sheet1 (entire first sheet). Sheet names with spaces or special chars: 'Q1 Sales'!B2:E20.",
  PARAM_RANGE_PLACEHOLDER: "e.g. Sheet1!A1:D10 or 'My Sheet'!A:C",
  PARAM_MAJOR_DIMENSION_LABEL: "Major Dimension",
  PARAM_MAJOR_DIMENSION_HINT:
    "ROWS: each inner array is one row (usual for tables). COLUMNS: each inner array is one column. Controls how the API returns nested arrays for reads.",
  PARAM_VALUE_RENDER_OPTION_LABEL: "Value Render Option",
  PARAM_VALUE_RENDER_OPTION_HINT:
    "FORMATTED_VALUE: display text as in the UI (default). UNFORMATTED_VALUE: raw numbers/dates without display formatting. FORMULA: return formula strings like =SUM(A1:A10) when the cell has a formula.",
  PARAM_VALUE_INPUT_OPTION_LABEL: "Value Input Option",
  PARAM_VALUE_INPUT_OPTION_HINT:
    'RAW: store values exactly as strings (e.g. "1-2" stays text, leading apostrophes preserved). USER_ENTERED: parsed as if typed in Sheets — numbers, dates, and strings starting with = become formulas (default).',
  PARAM_VALUES_LABEL: "Values",
  PARAM_VALUES_HINT:
    'JSON 2D array: outer = rows, inner = cells. For Update, dimensions should match the range. Examples: [["Name","Score"],["Ada",95]]; mixed types [["SKU",12,true]].',
  PARAM_VALUES_PLACEHOLDER: 'e.g. [["Name","Age"],["Alice",30],["Bob",25]]',

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
    "Sheets finds the last row with data inside this range, then appends after it. Cover all table columns (same width as each values row), e.g. Sheet1!A:F or Data!B:E. Too narrow a range can mis-detect the table end.",
  PARAM_APPEND_RANGE_PLACEHOLDER: "e.g. Sheet1!A:D or Orders!B:G",
  PARAM_INSERT_DATA_OPTION_LABEL: "Insert Data Option",
  PARAM_INSERT_DATA_OPTION_HINT:
    "INSERT_ROWS: insert new rows and shift existing rows down (safer when data may exist below). OVERWRITE: write into the next rows without inserting — can overwrite cells if the write range overlaps existing data.",
  PARAM_APPEND_VALUES_HINT:
    'One inner array per new row; column count should match the table. Examples: [["Eve","eve@ex.com",1],["Dan","dan@ex.com",2]]; single row [["2025-03-26",42.5]].',

  // Clear Values
  CLEAR_VALUES_TOOL_DISPLAY_NAME: "Clear Values",
  CLEAR_VALUES_TOOL_DESCRIPTION:
    "Clear all values from a specified range in a Google Sheets spreadsheet.",

  // Create Spreadsheet
  CREATE_SPREADSHEET_TOOL_DISPLAY_NAME: "Create Spreadsheet",
  CREATE_SPREADSHEET_TOOL_DESCRIPTION:
    "Create a new Google Sheets spreadsheet.",
  PARAM_TITLE_LABEL: "Title",
  PARAM_TITLE_HINT:
    "Shown in Drive and as the spreadsheet title bar. Examples: FY2025 Budget, Team Roster — Q1.",
  PARAM_TITLE_PLACEHOLDER: "e.g. FY2025 Budget Tracker",
  PARAM_SHEET_TITLES_LABEL: "Sheet Names (optional)",
  PARAM_SHEET_TITLES_HINT:
    "Comma-separated tab names, created left-to-right in this order. Leave empty for one default sheet. Example: Summary,Raw Data,Archive. Avoid commas inside a name here (rename in Sheets after creation if needed).",
  PARAM_SHEET_TITLES_PLACEHOLDER: "e.g. Summary, Raw Data, Archive",

  // Get Spreadsheet Info
  GET_SPREADSHEET_INFO_TOOL_DISPLAY_NAME: "Get Spreadsheet Info",
  GET_SPREADSHEET_INFO_TOOL_DESCRIPTION:
    "Get metadata and properties of a Google Sheets spreadsheet.",
  PARAM_INCLUDE_GRID_DATA_LABEL: "Include Grid Data",
  PARAM_INCLUDE_GRID_DATA_HINT:
    "When enabled, responses include cell values and can be very large on big spreadsheets. Leave off (default) for titles, sheetIds, grid size, and other metadata only — faster and lighter.",

  // Copy Sheet
  COPY_SHEET_TOOL_DISPLAY_NAME: "Copy Sheet",
  COPY_SHEET_TOOL_DESCRIPTION:
    "Copy a single sheet from one spreadsheet to another.",
  PARAM_SHEET_ID_LABEL: "Sheet ID",
  PARAM_SHEET_ID_HINT:
    "Numeric sheetId used by the API. From the browser: open the tab and read gid= in the URL (e.g. ...#gid=1234567890 → use 1234567890). The first sheet is often 0; confirm via Get Spreadsheet Info if unsure.",
  PARAM_SHEET_ID_PLACEHOLDER: "e.g. 0 or gid from URL (e.g. 1234567890)",
  PARAM_SOURCE_SPREADSHEET_ID_HINT:
    'The spreadsheet that currently contains the sheet to copy — same ID as "Spreadsheet ID" (between /d/ and /edit in the URL). Example: https://docs.google.com/spreadsheets/d/SOURCE_ID/edit',
  PARAM_DESTINATION_SPREADSHEET_ID_LABEL: "Destination Spreadsheet ID",
  PARAM_DESTINATION_SPREADSHEET_ID_HINT:
    "An existing spreadsheet where a new tab will be added as a copy. Your account needs edit access. The new sheet name may get a suffix if a duplicate name exists.",

  // Batch Get Values
  BATCH_GET_VALUES_TOOL_DISPLAY_NAME: "Batch Get Values",
  BATCH_GET_VALUES_TOOL_DESCRIPTION:
    "Read values from multiple ranges in a Google Sheets spreadsheet at once.",
  PARAM_RANGES_LABEL: "Ranges",
  PARAM_RANGES_HINT:
    "Several ranges in one request, separated by commas. Each uses A1 notation; spaces after commas are fine. Examples: Sheet1!A1:C10,Sheet2!A1:C10; 'Jan'!B:B,'Feb'!B:B for whole columns on quoted sheet names.",
  PARAM_RANGES_PLACEHOLDER:
    "e.g. Sheet1!A1:B10, Sheet2!A1:C5, 'Sales Q1'!D2:F99",

  // Clear-values tool — range field
  PARAM_CLEAR_RANGE_HINT:
    "Clears cell values only — formatting, notes, and validation remain. Same A1 rules as Read. Examples: Sheet1!C2:C500 (part of a column), Data!A1:Z200 (block).",
} satisfies BaseTranslation

export default en_US
