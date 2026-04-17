# List calendars (`wechat-work-list-calendars`)

Calls `GET /calendar/list` to get the calendar list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **offset** (optional): Offset for pagination (default: 0)
- **limit** (optional): Number of results (default: 500)

## Output

Returns `{ errcode, errmsg, calendar_list }` on success.