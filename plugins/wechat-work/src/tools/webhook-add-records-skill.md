# webhook-add-records

Add records to a smartsheet via webhook from external systems.

## When to use

Use this tool when you need to add records to a WeChat Work smartsheet from external systems (like Zapier, Make, or custom integrations). This is a webhook-based API that doesn't require authentication for properly configured webhooks.

## Parameters

- **key**: The webhook key for the smartsheet. This is obtained from the smartsheet's webhook configuration.
- **data**: JSON data to add as new records.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY`
- Official docs: https://developer.work.weixin.qq.com/document/145/15118

## Example

```json
{
  "key": "your-webhook-key",
  "data": [
    {
      "Name": "Record 1",
      "Status": "Active"
    },
    {
      "Name": "Record 2", 
      "Status": "Pending"
    }
  ]
}
```
