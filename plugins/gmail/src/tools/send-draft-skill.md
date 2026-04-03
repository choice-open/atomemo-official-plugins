# Send Draft Tool Documentation

## Tool

- **Name**: `gmail-send-draft`
- **Purpose**: Sends an existing draft (loads the draft then calls `drafts.send`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `draft_id` | `string` | `true` | `input` | Draft id to send. | `"r-1234567890abcdef"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "draft_id": "r-1234567890abcdef"
  }
}
```

## Tool Output Example

```json
{
  "message": {
    "id": "sentmsgid",
    "threadId": "threadid",
    "labelIds": ["SENT"]
  }
}
```
