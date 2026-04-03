# List History Tool Documentation

## Tool

- **Name**: `gmail-list-history`
- **Purpose**: Lists mailbox change history since `start_history_id` (for sync / incremental updates).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `start_history_id` | `string` | `true` | `input` | Starting history id from a prior profile or history response. | `"12345678"` |
| `label_ids` | `string` | `false` | `input` | Optional label filter (passed through to the API as supported). | `"INBOX"` |
| `max_results` | `integer` | `false` | `number-input` | Page size (1–500, default 50). | `100` |
| `page_token` | `string` | `false` | `input` | Pagination token. | |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "start_history_id": "12345678",
    "max_results": 100
  }
}
```

## Tool Output Example

```json
{
  "history": [],
  "historyId": "12345700",
  "nextPageToken": null
}
```
