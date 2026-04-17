# edit-spreadsheet-content

Edit cell data in a WeChat Work spreadsheet.

## When to use

Use this tool when you need to update cell values in a WeChat Work spreadsheet. Supports batch updates of multiple cells.

## Parameters

- **docid**: The spreadsheet document ID. You can get this from the spreadsheet URL or by using the create-wedoc tool.
- **sheet_id**: The sheet ID within the spreadsheet.
- **cells**: JSON object of cell data to update. Format should follow the WeChat Work spreadsheet cell update format.

## Cell Data Format

```json
{
  "A1": "value1",
  "B2": "value2"
}
```

Or with more complex data:

```json
{
  "cells": [
    {
      "row": 1,
      "col": 1,
      "value": "cell value"
    }
  ]
}
```

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/spreadsheet/batch_update`
- Official docs: https://developer.work.weixin.qq.com/document/145/15110

## Example

```json
{
  "docid": "your-spreadsheet-id",
  "sheet_id": "your-sheet-id",
  "cells": {
    "A1": "Hello",
    "B2": "World"
  }
}
```
