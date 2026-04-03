# Delete Label Tool Documentation

## Tool

- **Name**: `gmail-delete-label`
- **Purpose**: Permanently deletes a user-created label by id.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `label_id` | `string` | `true` | `input` | Label id to delete. | `"Label_abc123"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "label_id": "Label_abc123"
  }
}
```

## Tool Output Example

```json
{
  "success": true
}
```
