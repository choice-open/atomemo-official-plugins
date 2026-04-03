# Append Rows Tool Documentation

## Tool

- **Name**: `google-sheets-append-rows`
- **Purpose**: Appends rows of data after the last row of a table in a Google Sheets spreadsheet.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID (segment between `/d/` and `/edit` in the URL). | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `range` | `string` | `true` | `input` | A1 range covering the table columns; Sheets finds the last data row and appends after it. | `"Sheet1!A:D"` |
| `values` | `string` | `true` | `code-editor` | JSON 2D array: one inner array per new row; column count should match the table. | `"[[\"Eve\",\"eve@ex.com\",1],[\"Dan\",\"dan@ex.com\",2]]"` |
| `value_input_option` | `string` | `false` | `select` | `RAW` or `USER_ENTERED` (default). | `"USER_ENTERED"` |
| `insert_data_option` | `string` | `false` | `select` | `INSERT_ROWS` (default) or `OVERWRITE`. | `"INSERT_ROWS"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "range": "Sheet1!A:D",
    "values": "[[\"Eve\",\"eve@ex.com\",1],[\"Dan\",\"dan@ex.com\",2]]",
    "value_input_option": "USER_ENTERED",
    "insert_data_option": "INSERT_ROWS"
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "updates": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "updatedRange": "Sheet1!A5:C6",
    "updatedRows": 2,
    "updatedColumns": 3,
    "updatedCells": 6
  }
}
```
