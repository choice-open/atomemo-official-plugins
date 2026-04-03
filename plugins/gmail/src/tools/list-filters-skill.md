# List Filters Tool Documentation

## Tool

- **Name**: `gmail-list-filters`
- **Purpose**: Lists all Gmail filters (server rules). Response is JSON-cloned for schema compatibility.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me"
  }
}
```

## Tool Output Example

```json
{
  "filters": [
    {
      "id": "filterid",
      "criteria": { "from": "newsletter@example.com" },
      "action": { "addLabelIds": ["Label_1"] }
    }
  ]
}
```
