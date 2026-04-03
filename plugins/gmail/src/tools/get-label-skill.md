# Get Label Tool Documentation

## Tool

- **Name**: `gmail-get-label`
- **Purpose**: Retrieves a single label by id.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `label_id` | `string` | `true` | `input` | Label id (e.g. `INBOX`, `Label_123`). | `"INBOX"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "label_id": "INBOX"
  }
}
```

## Tool Output Example

```json
{
  "label": {
    "id": "INBOX",
    "name": "INBOX",
    "type": "system"
  }
}
```
