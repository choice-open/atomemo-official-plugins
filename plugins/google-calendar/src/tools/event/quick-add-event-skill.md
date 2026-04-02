# Quick Add Event Tool Documentation

## Tool

- **Name**: `quick-add-event`
- **Purpose**: Create an event from natural language text (Google quick add).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Target calendar ID. | `"primary"` |
| `text` | `string` | `true` | `input` | Natural language describing the event. | `"Dinner tomorrow 7pm"` |
| `send_updates` | `string` | `false` | `select` | `none`, `all`, `externalOnly`. Default `none`. | `"none"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "text": "Team sync Friday 2pm-3pm",
    "send_updates": "none"
  }
}
```

## Tool Output Example

```json
{
  "id": "event_id_xxx",
  "summary": "Team sync",
  "start": { "dateTime": "2026-04-04T14:00:00+08:00" }
}
```
