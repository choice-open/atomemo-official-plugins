# Update Label Tool Documentation

## Tool

- **Name**: `gmail-update-label`
- **Purpose**: Updates an existing label (currently supports renaming via `name`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `label_id` | `string` | `true` | `input` | Label id to update. | `"Label_abc123"` |
| `name` | `string` | `false` | `input` | New label name. | `"Projects / Q1"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "label_id": "Label_abc123",
    "name": "Projects / Q1"
  }
}
```

## Tool Output Example

```json
{
  "label": {
    "id": "Label_abc123",
    "name": "Projects / Q1",
    "type": "user"
  }
}
```
