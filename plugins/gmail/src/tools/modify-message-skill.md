# Modify Message Tool Documentation

## Tool

- **Name**: `gmail-modify-message`
- **Purpose**: Adds and/or removes labels on a single message. At least one of `add_label_ids` or `remove_label_ids` must be non-empty.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_id` | `string` | `true` | `input` | Message id. | `"18c5f2a3b4d5e6f7"` |
| `add_label_ids` | `string` | `false` | `input` | Label ids to add (parsed to array by the tool). | `"STARRED"` |
| `remove_label_ids` | `string` | `false` | `input` | Label ids to remove. | `"UNREAD"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_id": "18c5f2a3b4d5e6f7",
    "add_label_ids": "STARRED",
    "remove_label_ids": "UNREAD"
  }
}
```

## Tool Output Example

```json
{
  "message": {
    "id": "18c5f2a3b4d5e6f7",
    "labelIds": ["INBOX", "STARRED"]
  }
}
```
