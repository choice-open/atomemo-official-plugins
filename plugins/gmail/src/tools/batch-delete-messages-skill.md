# Batch Delete Messages Tool Documentation

## Tool

- **Name**: `gmail-batch-delete-messages`
- **Purpose**: Permanently deletes multiple messages in one request.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_ids` | `string` | `true` | `input` | Message ids to delete (parsed to array). | `"id1,id2"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_ids": "id1,id2"
  }
}
```

## Tool Output Example

```json
{
  "success": true
}
```
