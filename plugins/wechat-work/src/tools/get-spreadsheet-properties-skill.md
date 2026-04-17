# get-spreadsheet-properties

Get properties of sheets in a WeChat Work spreadsheet.

## When to use

Use this tool when you need to get information about sheets in a WeChat Work spreadsheet, including row and column counts.

## Parameters

- **docid**: The spreadsheet document ID. You can get this from the spreadsheet URL or by using the create-wedoc tool.
- **sheet_ids**: JSON array of sheet IDs to query (optional). If not specified, returns all sheets.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/spreadsheet/get_sheet_properties`
- Official docs: https://developer.work.weixin.qq.com/document/145/15109

## Example

```json
{
  "docid": "your-spreadsheet-id",
  "sheet_ids": ["sheet-id-1", "sheet-id-2"]
}
```
