# Update Draft Tool Documentation

## Tool

- **Name**: `gmail-update-draft`
- **Purpose**: Overwrites an existing draft with new To/Subject/Body (HTML body; base64url raw message).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `draft_id` | `string` | `true` | `input` | Draft id to update. | `"r-1234567890abcdef"` |
| `to` | `string` | `true` | `input` | Primary recipients. | `"alice@example.com"` |
| `subject` | `string` | `true` | `input` | Subject. | `"Re: Hello"` |
| `body` | `string` | `true` | `textarea` | HTML body source. | `"Updated body"` |
| `cc` | `string` | `false` | `input` | Cc. | |
| `bcc` | `string` | `false` | `input` | Bcc. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "draft_id": "r-1234567890abcdef",
    "to": "alice@example.com",
    "subject": "Re: Hello",
    "body": "Updated"
  }
}
```

## Tool Output Example

```json
{
  "draft": { "id": "r-1234567890abcdef", "message": {} },
  "id": "r-1234567890abcdef"
}
```
