# Create meeting (`wechat-work-create-meeting`)

Calls `POST /cgi-bin/meeting/create` to create a new meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **title** (required): Meeting title (max 64 chars).
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **attendees** (optional): JSON array of attendee userids.
- **meeting_type** (optional): Meeting type (0: regular, 1: recurring).
- **password** (optional): Meeting password.
- **meeting_collect_type** (optional): Collection type (0: by invite, 1: by register).
- **allow_host_ctrl** (optional): Allow host control (true/false).
- **media_type** (required): Media type (0: audio, 1: video, 3: all).

## Output

Returns the meeting ID.