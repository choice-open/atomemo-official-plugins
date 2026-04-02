# List Calendars Tool Documentation

## Tool

- **Name**: `list-calendars`
- **Purpose**: List calendars in the authenticated user’s calendar list.

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
  "kind": "calendar#calendarList",
  "items": [
    {
      "id": "user@gmail.com",
      "summary": "user@gmail.com",
      "primary": true
    }
  ]
}
```
