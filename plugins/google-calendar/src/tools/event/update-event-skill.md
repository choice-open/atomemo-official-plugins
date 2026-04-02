# Update Event Tool Documentation

## Tool

- **Name**: `update-event`
- **Purpose**: Update an existing event (partial patch).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar containing the event. | `"primary"` |
| `event_id` | `string` | `true` | `input` | Event ID (opaque, from list/get). | `"abc123..."` |
| `summary` | `string` | `true` | `input` | Event title. | `"Team standup"` |
| `is_all_day_event` | `boolean` | `false` | `switch` | If true, use `start_date` / `end_date`. Default false. | `false` |
| `start_datetime` | `string` | conditional | `input` | RFC3339 start when not all-day. | `"2026-04-02T09:00:00Z"` |
| `end_datetime` | `string` | conditional | `input` | RFC3339 end when not all-day. | `"2026-04-02T10:00:00Z"` |
| `start_date` | `string` | conditional | `input` | All-day start when all-day. | `"2026-04-02"` |
| `end_date` | `string` | conditional | `input` | All-day end (exclusive) when all-day. | `"2026-04-03"` |
| `timezone` | `string` | `false` | `input` | IANA timezone for timed events. | `"Asia/Shanghai"` |
| `send_updates` | `string` | `false` | `select` | `none`, `all`, `externalOnly`. Default `none`. | `"none"` |
| `include_details` | `boolean` | `false` | `switch` | Enable description and location. | `true` |
| `description` | `string` | `false` | `textarea` | Description when include details. | `"Updated notes"` |
| `location` | `string` | `false` | `input` | Location when include details. | `"Room B"` |
| `use_advanced_options` | `boolean` | `false` | `switch` | Advanced fields. | `true` |
| `visibility` | `string` | `false` | `select` | `default`, `public`, `private`, `confidential`. | `"private"` |
| `transparency` | `string` | `false` | `select` | `opaque` or `transparent`. | `"opaque"` |
| `status` | `string` | `false` | `select` | `confirmed` or `tentative`. | `"confirmed"` |
| `color_id` | `string` | `false` | `select` | Event color `1`–`11`. | `"2"` |
| `recurrence` | `string` | `false` | `input` | RFC5545 rules, newline-separated. | `"RRULE:FREQ=DAILY;COUNT=3"` |
| `attendees` | `string` | `false` | `input` | Comma-separated emails. | `"a@x.com"` |
| `guests_can_invite_others` | `boolean` | `false` | `switch` | Guests can invite others. | `true` |
| `guests_can_modify` | `boolean` | `false` | `switch` | Guests can modify. | `false` |
| `guests_can_see_other_guests` | `boolean` | `false` | `switch` | Guests see other guests. | `true` |
| `max_attendees` | `number` | `false` | `number-input` | Max attendees in response (advanced). | `10` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "event_id": "event_id_xxx",
    "summary": "Team standup",
    "is_all_day_event": false,
    "start_datetime": "2026-04-02T10:00:00Z",
    "end_datetime": "2026-04-02T10:30:00Z",
    "send_updates": "all"
  }
}
```

## Tool Output Example

```json
{
  "id": "event_id_xxx",
  "summary": "Team standup",
  "updated": "2026-04-02T08:00:00.000Z"
}
```
