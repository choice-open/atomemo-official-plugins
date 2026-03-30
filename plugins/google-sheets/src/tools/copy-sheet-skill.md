# Copy Sheet Tool Documentation

## Tool

- **Name**: `google-sheets-copy-sheet`
- **Purpose**: Copies a single sheet from one spreadsheet to another (adds a new tab on the destination).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Source spreadsheet ID (the sheet to copy lives here). | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `sheet_id` | `number` | `true` | `number-input` | Numeric sheet ID (e.g. `gid` from the tab URL). | `1234567890` |
| `destination_spreadsheet_id` | `string` | `true` | `input` | Existing spreadsheet where the copy will be added. | `"1abc...xyz"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "sheet_id": 0,
    "destination_spreadsheet_id": "1abcDEFghiJKLmnoPQRstuVWXyz"
  }
}
```

## Tool Output Example

```json
{
  "sheetId": 9876543210,
  "title": "Sheet1",
  "index": 1,
  "sheetType": "GRID",
  "gridProperties": {
    "rowCount": 1000,
    "columnCount": 26
  }
}
```
