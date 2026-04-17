# Create calendar event (`wechat-work-create-event`)

Calls `POST /cgi-bin/calendar/add` to create a new calendar event.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **cal_id** (required): Calendar ID.
- **title** (required): Event title (max 128 chars).
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **location** (optional): Location (max 256 chars).
- **description** (optional): Description (max 2048 chars).
- **reminders** (optional): JSON array of reminder settings.
- **attendees** (optional): JSON array of attendees (userid or partyid).
- **alarm_type** (optional): Alarm type.
- **alarm_time_before** (optional): Minutes before to alarm.

## Output

Returns the created event ID.