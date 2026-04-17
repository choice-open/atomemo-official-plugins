# Create webinar (`wechat-work-create-webinar`)

Calls `POST /cgi-bin/webinar/create` to create a new webinar.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **subject** (required): Webinar subject (max 64 chars).
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **cover_pic_media_id** (optional): Cover picture media ID.
- **description** (optional): Webinar description.
- **password** (optional): Webinar password.
- **max_participants** (optional): Maximum number of participants.

## Output

Returns the webinar ID.
