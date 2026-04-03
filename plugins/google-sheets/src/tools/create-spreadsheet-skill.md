# Create Spreadsheet Tool Documentation

## Tool

- **Name**: `google-sheets-create-spreadsheet`
- **Purpose**: Creates a new Google Sheets spreadsheet.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `title` | `string` | `true` | `input` | Spreadsheet title (shown in Drive and the title bar). | `"FY2025 Budget Tracker"` |
| `sheet_titles` | `string` | `false` | `input` | Optional comma-separated tab names, left to right. | `"Summary, Raw Data, Archive"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "title": "FY2025 Budget Tracker",
    "sheet_titles": "Summary, Raw Data, Archive"
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1NewSpreadsheetIdFromApiXXXXXXXXXXXX",
  "properties": {
    "title": "FY2025 Budget Tracker",
    "locale": "en_US",
    "timeZone": "America/Los_Angeles"
  },
  "sheets": [
    {
      "properties": {
        "sheetId": 0,
        "title": "Summary",
        "index": 0,
        "sheetType": "GRID"
      }
    },
    {
      "properties": {
        "sheetId": 1,
        "title": "Raw Data",
        "index": 1,
        "sheetType": "GRID"
      }
    }
  ]
}
```
