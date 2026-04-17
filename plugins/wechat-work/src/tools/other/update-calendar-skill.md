# Update calendar (`wechat-work-update-calendar`)

Calls `POST /cgi-bin/calendar/update` to update an existing calendar.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **cal_id** (required): Calendar ID to update.
- **title** (optional): New calendar title (max 64 characters).
- **color** (optional): New calendar color (0-10).
- **description** (optional): New calendar description (max 255 characters).

## Output

Returns success status on successful update.
