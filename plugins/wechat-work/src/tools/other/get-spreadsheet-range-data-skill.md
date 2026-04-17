# get-spreadsheet-range-data

Get data from a specific range in a WeChat Work spreadsheet.

## When to use

Use this tool when you need to retrieve data from a WeChat Work spreadsheet. You can get data from a specific cell range or the entire sheet.

## Parameters

- **docid**: The spreadsheet document ID. You can get this from the spreadsheet URL or by using the create-wedoc tool.
- **sheet_id**: The sheet ID within the spreadsheet.
- **range**: The cell range to retrieve (optional). Format like 'A1:B10'. If not specified, returns all data.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/spreadsheet/get_sheet_range_data`
- Official docs: https://developer.work.weixin.qq.com/document/145/15108

## Example

```json
{
  "docid": "your-spreadsheet-id",
  "sheet_id": "your-sheet-id",
  "range": "A1:C10"
}
```
