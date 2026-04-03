# Get Spreadsheet Info Tool Documentation

## Tool

- **Name**: `google-sheets-get-spreadsheet-info`
- **Purpose**: Returns metadata and properties of a Google Sheets spreadsheet (optionally including grid cell data).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID. | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `include_grid_data` | `boolean` | `false` | `switch` | When `true`, includes cell values (can be large). Default `false`. | `false` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "include_grid_data": false
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "properties": {
    "title": "Team Roster",
    "locale": "en_US",
    "timeZone": "America/New_York"
  },
  "sheets": [
    {
      "properties": {
        "sheetId": 0,
        "title": "Sheet1",
        "index": 0,
        "sheetType": "GRID",
        "gridProperties": {
          "rowCount": 1000,
          "columnCount": 26
        }
      }
    }
  ]
}
```
