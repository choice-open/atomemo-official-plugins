# Batch Get Values Tool Documentation

## Tool

- **Name**: `google-sheets-batch-get-values`
- **Purpose**: Reads values from multiple ranges in a Google Sheets spreadsheet at once.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `Google_Sheets_OAuth2`. | `"cred_xxx"` |
| `spreadsheet_id` | `string` | `true` | `input` | Spreadsheet ID. | `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"` |
| `ranges` | `string` | `true` | `input` | Comma-separated A1 ranges. | `"Sheet1!A1:B10, Sheet2!A1:C5"` |
| `major_dimension` | `string` | `false` | `select` | `ROWS` (default) or `COLUMNS`. | `"ROWS"` |
| `value_render_option` | `string` | `false` | `select` | `FORMATTED_VALUE` (default), `UNFORMATTED_VALUE`, or `FORMULA`. | `"FORMATTED_VALUE"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "ranges": "Sheet1!A1:B10, Sheet2!A1:C5",
    "major_dimension": "ROWS",
    "value_render_option": "FORMATTED_VALUE"
  }
}
```

## Tool Output Example

```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "valueRanges": [
    {
      "range": "Sheet1!A1:B10",
      "majorDimension": "ROWS",
      "values": [["Name", "Score"], ["Ada", "95"]]
    },
    {
      "range": "Sheet2!A1:C5",
      "majorDimension": "ROWS",
      "values": [["A", "B", "C"]]
    }
  ]
}
```
