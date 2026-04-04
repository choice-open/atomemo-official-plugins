# Get Draft Tool Documentation

## Tool

- **Name**: `gmail-get-draft`
- **Purpose**: Retrieves a single draft (`format: full`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `draft_id` | `string` | `true` | `input` | Draft id. | `"r-1234567890abcdef"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "draft_id": "r-1234567890abcdef"
  }
}
```

## Tool Output Example

```json
{
  "draft": {
    "id": "r-1234567890abcdef",
    "message": { "raw": "..." }
  }
}
```
