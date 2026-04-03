# List Messages Tool Documentation

## Tool

- **Name**: `gmail-list-messages`
- **Purpose**: Lists message ids matching optional query and label filters, with pagination.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `q` | `string` | `false` | `input` | Gmail search query. | `"from:alice is:unread"` |
| `label_ids` | `string` | `false` | `input` | Restrict to labels (format as supported by the host). | `"INBOX"` |
| `max_results` | `integer` | `false` | `number-input` | Page size (1–500, default 50). | `50` |
| `page_token` | `string` | `false` | `input` | Token from a previous response for the next page. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "q": "is:unread",
    "max_results": 20
  }
}
```

## Tool Output Example

```json
{
  "messages": [{ "id": "msgid", "threadId": "threadid" }],
  "nextPageToken": null,
  "resultSizeEstimate": 5
}
```
