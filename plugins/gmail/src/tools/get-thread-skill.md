# Get Thread Tool Documentation

## Tool

- **Name**: `gmail-get-thread`
- **Purpose**: Fetches a thread with all messages (`format: full`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `thread_id` | `string` | `true` | `input` | Thread id. | `"18c5f2a3b4d5e6f7"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "thread_id": "18c5f2a3b4d5e6f7"
  }
}
```

## Tool Output Example

```json
{
  "thread": {
    "id": "18c5f2a3b4d5e6f7",
    "historyId": "999",
    "messages": []
  }
}
```
