# update-smartsheet-records

Update existing records in a smartsheet tab.

## When to use

Use this tool when you need to update existing records in a WeChat Work smartsheet. Each record must include the row_id to identify which record to update.

## Parameters

- **sheet_id**: The smartsheet tab ID. You can get this from the get-smartsheet tool.
- **records**: JSON array of record objects with row_id to update. Each record should contain the row_id and the fields to update.

## Record Format

Each record should be an object with:

- **row_id**: The ID of the record to update (required)
- **fields**: Object containing field names and their new values (required)

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/smartsheet/update_records`
- Official docs: https://developer.work.weixin.qq.com/document/145/15113

## Example

```json
{
  "sheet_id": "your-sheet-id",
  "records": [
    {
      "row_id": "record-id-1",
      "fields": {
        "Name": "Updated Name",
        "Status": "Completed"
      }
    }
  ]
}
```
