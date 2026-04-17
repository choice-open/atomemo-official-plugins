# Update advanced meeting (`wechat-work-update-advanced-meeting`)

Calls `POST /cgi-bin/meeting/advanced/update` to update an advanced meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to update.
- **title** (optional): Meeting title (max 64 chars).
- **start_time** (optional): Start time (Unix timestamp).
- **end_time** (optional): End time (Unix timestamp).
- **media_type** (optional): Media type (0: audio, 1: video, 3: all).
- **meeting_type** (optional): Meeting type (0: regular, 1: recurring).
- **attendees** (optional): JSON array of attendee userids.
- **password** (optional): Meeting password.
- **meeting_collect_type** (optional): Collection type (0: by invite, 1: by register).
- **allow_host_ctrl** (optional): Allow host control (0: no, 1: yes).
- **enable_screen_share** (optional): Enable screen share (0: no, 1: yes).
- **enable_recording** (optional): Enable recording (0: no, 1: yes).

## Output

Returns operation result.
