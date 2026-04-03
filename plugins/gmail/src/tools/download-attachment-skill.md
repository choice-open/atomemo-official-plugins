# Download Attachment Tool Documentation

## Tool

- **Name**: `gmail-download-attachment`
- **Purpose**: Downloads an attachment and **uploads** it via `context.files.upload`, returning a file reference for use in the host.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `message_id` | `string` | `true` | `input` | Parent message id. | `"18c5f2a3b4d5e6f7"` |
| `attachment_id` | `string` | `true` | `input` | Attachment id. | `"ANGjdJ_abc"` |
| `filename` | `string` | `false` | `input` | Suggested filename; default `attachment-{attachmentId}`. | `"report.pdf"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "message_id": "18c5f2a3b4d5e6f7",
    "attachment_id": "ANGjdJ_abc",
    "filename": "report.pdf"
  }
}
```

## Tool Output Example

```json
{
  "file": {
    "__type__": "file_ref",
    "filename": "report.pdf",
    "mime_type": "application/pdf",
    "size": 1024
  }
}
```
