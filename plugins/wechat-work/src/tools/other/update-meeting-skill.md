# Update meeting (`wechat-work-update-meeting`)

Calls `POST /cgi-bin/meeting/update` to update an existing meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to update.
- **title** (optional): Meeting title (max 64 chars).
- **start_time** (optional): Start time (Unix timestamp).
- **end_time** (optional): End time (Unix timestamp).
- **attendees** (optional): JSON array of attendee userids.
- **media_type** (optional): Media type (0: audio, 1: video, 3: all).
- **password** (optional): Meeting password.

## Output

Returns success status.