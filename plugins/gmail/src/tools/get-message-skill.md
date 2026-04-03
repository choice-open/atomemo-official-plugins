# Get Message Tool Documentation

## Tool

- **Name**: `gmail-get-message`
- **Purpose**: Fetches a full message resource (`format: full`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_id` | `string` | `true` | `input` | Message id. | `"18c5f2a3b4d5e6f7"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_id": "18c5f2a3b4d5e6f7"
  }
}
```

## Tool Output Example

```json
{
  "message": {
    "id": "18c5f2a3b4d5e6f7",
    "threadId": "threadid",
    "labelIds": ["INBOX"],
    "snippet": "Hello…",
    "payload": {}
  }
}
```
