# Get Attachment Tool Documentation

## Tool

- **Name**: `gmail-get-attachment`
- **Purpose**: Fetches attachment metadata and body as **standard base64** in the response (not uploaded as a file).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_id` | `string` | `true` | `input` | Message containing the attachment. | `"18c5f2a3b4d5e6f7"` |
| `attachment_id` | `string` | `true` | `input` | Attachment id from the message payload. | `"ANGjdJ_..."` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_id": "18c5f2a3b4d5e6f7",
    "attachment_id": "ANGjdJ_abc"
  }
}
```

## Tool Output Example

```json
{
  "data": "JVBERi0xLjQK...",
  "size": 1024,
  "attachmentId": "ANGjdJ_abc"
}
```
