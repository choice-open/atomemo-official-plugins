# Move Event Tool Documentation

## Tool

- **Name**: `move-event`
- **Purpose**: Move an event to another calendar.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Source calendar ID. | `"primary"` |
| `event_id` | `string` | `true` | `input` | Event ID to move. | `"abc123..."` |
| `destination_calendar_id` | `string` | `true` | `input` | Target calendar (`primary` or calendar email). | `"other@group.calendar.google.com"` |
| `send_updates` | `string` | `false` | `select` | `none`, `all`, `externalOnly`. Default `none`. | `"all"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "event_id": "event_id_xxx",
    "destination_calendar_id": "work@group.calendar.google.com",
    "send_updates": "all"
  }
}
```

## Tool Output Example

```json
{
  "id": "event_id_xxx",
  "organizer": { "email": "user@example.com" },
  "summary": "Moved meeting"
}
```
