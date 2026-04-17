# Delete calendar event (`wechat-work-delete-event`)

Calls `POST /cgi-bin/calendar/delete` to delete a calendar event.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **cal_id** (required): Calendar ID.
- **event_id** (required): Event ID to delete.

## Output

Returns success status.