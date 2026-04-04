# Clear Values Tool Documentation

## Tool

- **Name**: `google-sheets-clear-values`
- **Purpose**: Clears all values from a specified range in a Google Sheets spreadsheet (formatting and notes remain).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID. | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `range` | `string` | `true` | `input` | A1 range to clear. | `"Sheet1!C2:C500"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "range": "Sheet1!A1:Z200"
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "clearedRange": "Sheet1!A1:Z200"
}
```
