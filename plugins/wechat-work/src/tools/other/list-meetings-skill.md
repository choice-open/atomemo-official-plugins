# List meetings (`wechat-work-list-meetings`)

Calls `POST /meeting/list` to get the meeting list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **meeting_start_from** (optional): Start time range (Unix timestamp)
- **meeting_start_to** (optional): End time range (Unix timestamp)
- **limit** (optional): Number of results (default: 20)

## Output

Returns `{ errcode, errmsg, meeting_list }` on success.