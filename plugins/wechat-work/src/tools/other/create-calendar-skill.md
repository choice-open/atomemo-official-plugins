# Create calendar (`wechat-work-create-calendar`)

Calls `POST /cgi-bin/calendar/create` to create a new calendar.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **title** (required): Calendar title (max 64 characters).
- **color** (optional): Calendar color (0-10, default: 0).
- **description** (optional): Calendar description (max 255 characters).
- **shares** (optional): JSON array of shares config.

## Output

Returns the created calendar ID.
