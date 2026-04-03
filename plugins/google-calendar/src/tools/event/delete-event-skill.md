# Delete Event Tool Documentation

## Tool

- **Name**: `delete-event`
- **Purpose**: Delete an event from Google Calendar.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID. | `"primary"` |
| `event_id` | `string` | `true` | `input` | Event ID to delete. | `"abc123..."` |
| `send_updates` | `string` | `false` | `select` | Notifications: `none`, `all`, `externalOnly`. Default `none`. | `"all"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "event_id": "event_id_xxx",
    "send_updates": "all"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "deleted_event_id": "event_id_xxx"
}
```
