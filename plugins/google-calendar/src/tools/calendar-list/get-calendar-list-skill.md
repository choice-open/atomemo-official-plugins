# Get Calendar List Entry Tool Documentation

## Tool

- **Name**: `get-calendar-list`
- **Purpose**: Get a single entry from the user’s calendar list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID. | `"primary"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary"
  }
}
```

## Tool Output Example

```json
{
  "id": "user@gmail.com",
  "summary": "user@gmail.com",
  "selected": true,
  "primary": true
}
```
