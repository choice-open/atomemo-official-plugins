# Stop school live (`wechat-work-stop-school-live`)

Calls `POST /cgi-bin/school/live/stop` to stop an ongoing school live broadcast.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): School ID from education management console
- **live_id** (required): Live broadcast ID to stop

## Output

Returns success status.