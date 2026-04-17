# Update calendar event (`wechat-work-update-event`)

Calls `POST /cgi-bin/calendar/update` to update an existing calendar event.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **cal_id** (required): Calendar ID.
- **event_id** (required): Event ID to update.
- **title** (optional): Event title (max 128 chars).
- **start_time** (optional): Start time (Unix timestamp).
- **end_time** (optional): End time (Unix timestamp).
- **location** (optional): Location (max 256 chars).
- **description** (optional): Description (max 2048 chars).
- **attendees** (optional): JSON array of attendees (userid or partyid).
- **alarm_type** (optional): Alarm type.
- **alarm_time_before** (optional): Minutes before to alarm.

## Output

Returns success status.