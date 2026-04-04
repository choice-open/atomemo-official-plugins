# Update Rows Tool Documentation

## Tool

- **Name**: `google-sheets-update-rows`
- **Purpose**: Writes values to a specified range in a Google Sheets spreadsheet (overwrites existing cells in that range).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID. | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `range` | `string` | `true` | `input` | A1 range to write; dimensions should match `values`. | `"Sheet1!A1:C3"` |
| `values` | `string` | `true` | `code-editor` | JSON 2D array (rows × cells). | `"[[\"Name\",\"Age\",\"City\"],[\"Alice\",30,\"NYC\"]]"` |
| `value_input_option` | `string` | `false` | `select` | `RAW` or `USER_ENTERED` (default). | `"USER_ENTERED"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "range": "Sheet1!A1:C3",
    "values": "[[\"Name\",\"Age\",\"City\"],[\"Alice\",30,\"NYC\"],[\"Bob\",25,\"SF\"]]",
    "value_input_option": "USER_ENTERED"
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "updatedRange": "Sheet1!A1:C3",
  "updatedRows": 3,
  "updatedColumns": 3,
  "updatedCells": 9
}
```
