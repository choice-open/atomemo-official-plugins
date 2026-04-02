# Read Rows Tool Documentation

## Tool

- **Name**: `google-sheets-read-rows`
- **Purpose**: Reads values from a specified range in a Google Sheets spreadsheet.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID. | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `range` | `string` | `true` | `input` | A1 notation range. | `"Sheet1!A1:D10"` |
| `major_dimension` | `string` | `false` | `select` | `ROWS` (default) or `COLUMNS`. | `"ROWS"` |
| `value_render_option` | `string` | `false` | `select` | `FORMATTED_VALUE` (default), `UNFORMATTED_VALUE`, or `FORMULA`. | `"FORMATTED_VALUE"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "range": "Sheet1!A1:D10",
    "major_dimension": "ROWS",
    "value_render_option": "FORMATTED_VALUE"
  }
}
```

## Tool Output Example

```json
{
  "range": "Sheet1!A1:D3",
  "majorDimension": "ROWS",
  "values": [
    ["Name", "Age", "City", "Active"],
    ["Alice", "30", "NYC", "TRUE"],
    ["Bob", "25", "SF", "FALSE"]
  ]
}
```
