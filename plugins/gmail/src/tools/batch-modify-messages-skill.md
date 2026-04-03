# Batch Modify Messages Tool Documentation

## Tool

- **Name**: `gmail-batch-modify-messages`
- **Purpose**: Applies label changes to multiple messages in one call. `message_ids` must be non-empty; at least one of `add_label_ids` or `remove_label_ids` must be non-empty.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_ids` | `string` | `true` | `input` | One or more message ids (parsed to array). | `"id1,id2"` |
| `add_label_ids` | `string` | `false` | `input` | Labels to add. | `"STARRED"` |
| `remove_label_ids` | `string` | `false` | `input` | Labels to remove. | `"UNREAD"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_ids": "id1,id2",
    "remove_label_ids": "UNREAD"
  }
}
```

## Tool Output Example

```json
{
  "success": true
}
```
