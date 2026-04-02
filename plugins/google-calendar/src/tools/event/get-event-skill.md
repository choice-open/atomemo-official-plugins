# Get Event Tool Documentation

## Tool

- **Name**: `get-event`
- **Purpose**: Get a single event by ID.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID. | `"primary"` |
| `event_id` | `string` | `true` | `input` | Event ID. | `"abc123..."` |
| `max_attendees` | `number` | `false` | `number-input` | Cap attendees in the response. | `50` |
| `time_zone` | `string` | `false` | `input` | IANA timezone for times in the response. | `"Asia/Shanghai"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "event_id": "event_id_xxx"
  }
}
```

## Tool Output Example

```json
{
  "id": "event_id_xxx",
  "summary": "Meeting",
  "start": { "dateTime": "2026-04-02T09:00:00+08:00", "timeZone": "Asia/Shanghai" },
  "end": { "dateTime": "2026-04-02T10:00:00+08:00", "timeZone": "Asia/Shanghai" }
}
```
