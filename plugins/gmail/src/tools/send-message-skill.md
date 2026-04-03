# Send Message Tool Documentation

## Tool

- **Name**: `gmail-send-message`
- **Purpose**: Sends a new email (HTML body; raw message base64url per Gmail `messages.send`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `to` | `string` | `true` | `input` | Primary recipients. | `"alice@example.com"` |
| `subject` | `string` | `true` | `input` | Subject. | `"Hello"` |
| `body` | `string` | `true` | `textarea` | HTML body; `\n` → `<br>`. | `"Hi Alice"` |
| `cc` | `string` | `false` | `input` | Cc. | |
| `bcc` | `string` | `false` | `input` | Bcc. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "to": "alice@example.com",
    "subject": "Hello",
    "body": "Hi there"
  }
}
```

## Tool Output Example

```json
{
  "message": { "id": "msgid", "threadId": "threadid", "labelIds": ["SENT"] },
  "id": "msgid"
}
```
