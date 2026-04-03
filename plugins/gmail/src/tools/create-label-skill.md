# Create Label Tool Documentation

## Tool

- **Name**: `gmail-create-label`
- **Purpose**: Creates a new user label with default visibility (`labelShow` / `show`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `name` | `string` | `true` | `input` | Display name for the new label. | `"Projects"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "name": "Projects"
  }
}
```

## Tool Output Example

```json
{
  "label": {
    "id": "Label_abc123",
    "name": "Projects",
    "type": "user"
  }
}
```
