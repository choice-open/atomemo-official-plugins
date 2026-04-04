# List Settings Tool Documentation

## Tool

- **Name**: `list-settings`
- **Purpose**: List all user settings for the calendar account.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx"
  }
}
```

## Tool Output Example

```json
{
  "kind": "calendar#settings",
  "items": [
    { "id": "timezone", "value": "Asia/Shanghai" },
    { "id": "locale", "value": "en" }
  ]
}
```
