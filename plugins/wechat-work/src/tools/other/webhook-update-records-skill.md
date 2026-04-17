# webhook-update-records

Update records in a smartsheet via webhook from external systems.

## When to use

Use this tool when you need to update existing records in a WeChat Work smartsheet from external systems (like Zapier, Make, or custom integrations). This is a webhook-based API that doesn't require authentication for properly configured webhooks.

## Parameters

- **key**: The webhook key for the smartsheet. This is obtained from the smartsheet's webhook configuration.
- **data**: JSON data to update existing records. Each record should include a row_id to identify which record to update.

## Data Format

```json
{
  "data": [
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

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY&action=update`
- Official docs: https://developer.work.weixin.qq.com/document/145/15119

## Example

```json
{
  "key": "your-webhook-key",
  "data": {
    "data": [
      {
        "row_id": "record-id-to-update",
        "fields": {
          "Status": "Completed"
        }
      }
    ]
  }
}
```
