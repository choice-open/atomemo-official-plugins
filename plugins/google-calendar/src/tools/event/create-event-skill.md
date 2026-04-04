# Create Event Tool Documentation

## Tool

- **Name**: `create-event`
- **Purpose**: Create a new event on Google Calendar.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID; use `primary` for the main calendar. | `"primary"` |
| `summary` | `string` | `true` | `input` | Event title. | `"Team standup"` |
| `is_all_day_event` | `boolean` | `false` | `switch` | If true, use `start_date` / `end_date` instead of datetimes. Default false. | `false` |
| `start_datetime` | `string` | conditional | `input` | RFC3339 start (required when not all-day). | `"2026-04-02T09:00:00+08:00"` |
| `end_datetime` | `string` | conditional | `input` | RFC3339 end, exclusive of start (required when not all-day). | `"2026-04-02T10:00:00+08:00"` |
| `start_date` | `string` | conditional | `input` | All-day start `yyyy-mm-dd` (required when all-day). | `"2026-04-02"` |
| `end_date` | `string` | conditional | `input` | All-day end date, exclusive (required when all-day). | `"2026-04-03"` |
| `timezone` | `string` | `false` | `input` | IANA timezone for timed events (e.g. `Asia/Shanghai`). | `"Asia/Shanghai"` |
| `send_updates` | `string` | `false` | `select` | Notifications: `none`, `all`, `externalOnly`. Default `none`. | `"none"` |
| `include_details` | `boolean` | `false` | `switch` | Enable description and location fields. Default false. | `true` |
| `description` | `string` | `false` | `textarea` | Event description (when include details). | `"Agenda in doc"` |
| `location` | `string` | `false` | `input` | Location (when include details). | `"Room A"` |
| `use_advanced_options` | `boolean` | `false` | `switch` | Show visibility, recurrence, attendees, etc. Default false. | `true` |
| `visibility` | `string` | `false` | `select` | `default`, `public`, `private`, `confidential`. | `"default"` |
| `transparency` | `string` | `false` | `select` | `opaque` (busy) or `transparent` (free). | `"opaque"` |
| `status` | `string` | `false` | `select` | `confirmed` or `tentative`. | `"confirmed"` |
| `color_id` | `string` | `false` | `select` | Event color `1`–`11` (see Get Colors). | `"1"` |
| `recurrence` | `string` | `false` | `input` | RFC5545 rules, newline-separated. | `"RRULE:FREQ=WEEKLY;BYDAY=MO"` |
| `attendees` | `string` | `false` | `input` | Comma-separated attendee emails. | `"a@x.com,b@y.com"` |
| `guests_can_invite_others` | `boolean` | `false` | `switch` | Allow guests to invite others. Default true. | `true` |
| `guests_can_modify` | `boolean` | `false` | `switch` | Allow guests to modify. Default false. | `false` |
| `guests_can_see_other_guests` | `boolean` | `false` | `switch` | Guests see other guests. Default true. | `true` |
| `max_attendees` | `number` | `false` | `number-input` | Cap attendees returned in the API response (advanced). | `10` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "summary": "Team standup",
    "is_all_day_event": false,
    "start_datetime": "2026-04-02T09:00:00Z",
    "end_datetime": "2026-04-02T09:30:00Z",
    "send_updates": "none"
  }
}
```

## Tool Output Example

```json
{
  "id": "event_id_xxx",
  "summary": "Team standup",
  "status": "confirmed"
}
```
