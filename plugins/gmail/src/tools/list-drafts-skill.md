# List Drafts Tool Documentation

## Tool

- **Name**: `gmail-list-drafts`
- **Purpose**: Lists drafts with pagination.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `max_results` | `integer` | `false` | `number-input` | Page size (1–500, default 50). | `20` |
| `page_token` | `string` | `false` | `input` | Pagination token. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "max_results": 20
  }
}
```

## Tool Output Example

```json
{
  "drafts": [{ "id": "r-abc", "message": { "id": "msgid" } }],
  "nextPageToken": null,
  "resultSizeEstimate": 1
}
```
