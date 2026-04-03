# Watch Tool Documentation

## Tool

- **Name**: `gmail-watch`
- **Purpose**: Sets up push notifications via Google Cloud Pub/Sub for mailbox changes (Gmail `users.watch`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `topic_name` | `string` | `true` | `input` | Full Pub/Sub topic resource name. | `"projects/my-project/topics/gmail-push"` |
| `label_ids` | `string` | `false` | `input` | Optional label ids (comma-separated or as parsed by the host). | `"INBOX"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "topic_name": "projects/my-project/topics/gmail-push",
    "label_ids": "INBOX"
  }
}
```

## Tool Output Example

```json
{
  "expiration": "1234567890000",
  "historyId": "987654"
}
```
