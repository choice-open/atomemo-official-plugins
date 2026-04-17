# Set meeting background (`wechat-work-set-meeting-background`)

Calls `POST /cgi-bin/meeting/background/set` to set a custom background for a meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to set background.
- **background_media_id** (required): Media ID of the background image.
- **background_type** (optional): Background type (0: global, 1: waiting room).

## Output

Returns operation result.
