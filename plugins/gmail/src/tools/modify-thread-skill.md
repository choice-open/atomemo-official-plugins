# Modify Thread Tool Documentation

## Tool

- **Name**: `gmail-modify-thread`
- **Purpose**: Adds and/or removes labels on every message in a thread.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `thread_id` | `string` | `true` | `input` | Thread id. | `"18c5f2a3b4d5e6f7"` |
| `add_label_ids` | `string` | `false` | `input` | Label ids to add. | `"STARRED"` |
| `remove_label_ids` | `string` | `false` | `input` | Label ids to remove. | `"INBOX"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "thread_id": "18c5f2a3b4d5e6f7",
    "add_label_ids": "Label_abc"
  }
}
```

## Tool Output Example

```json
{
  "thread": {
    "id": "18c5f2a3b4d5e6f7",
    "messages": []
  }
}
```
