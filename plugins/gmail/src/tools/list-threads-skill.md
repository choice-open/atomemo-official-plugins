# List Threads Tool Documentation

## Tool

- **Name**: `gmail-list-threads`
- **Purpose**: Lists conversation threads matching optional query and label filters.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `q` | `string` | `false` | `input` | Gmail search query. | `"subject:invoice"` |
| `label_ids` | `string` | `false` | `input` | Label filter. | `"INBOX"` |
| `max_results` | `integer` | `false` | `number-input` | Page size (1–500, default 50). | `50` |
| `page_token` | `string` | `false` | `input` | Pagination token. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "q": "in:inbox",
    "max_results": 10
  }
}
```

## Tool Output Example

```json
{
  "threads": [{ "id": "threadid", "historyId": "1" }],
  "nextPageToken": null,
  "resultSizeEstimate": 3
}
```
