# Create Draft Tool Documentation

## Tool

- **Name**: `gmail-create-draft`
- **Purpose**: Creates a draft from To/Subject/Body (HTML body; newlines become `<br>`). Raw message uses standard base64url encoding for the Gmail API.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `to` | `string` | `true` | `input` | Primary recipients. | `"alice@example.com"` |
| `subject` | `string` | `true` | `input` | Subject (RFC 2047 encoded when needed). | `"Draft subject"` |
| `body` | `string` | `true` | `textarea` | HTML body source; `\n` → `<br>`. | `"Hello\nWorld"` |
| `cc` | `string` | `false` | `input` | Cc addresses. | `"bob@example.com"` |
| `bcc` | `string` | `false` | `input` | Bcc addresses. | | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "to": "alice@example.com",
    "subject": "Hello",
    "body": "Line one\nLine two",
    "cc": "bob@example.com"
  }
}
```

## Tool Output Example

```json
{
  "draft": { "id": "r-newdraft", "message": { "id": "msgid" } },
  "id": "r-newdraft"
}
```
