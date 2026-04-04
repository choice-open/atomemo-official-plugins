# Get Calendar Tool Documentation

## Tool

- **Name**: `get-calendar`
- **Purpose**: Get calendar metadata by ID.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID (`primary` or email-style id). | `"primary"` |

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
  "timeZone": "Asia/Shanghai"
}
```
