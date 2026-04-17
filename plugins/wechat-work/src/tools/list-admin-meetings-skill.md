# List admin meetings (`wechat-work-list-admin-meetings`)

Calls `GET /cgi-bin/meeting/admin_list` to get list of meetings organized by admin.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **organizer_userid** (optional): Filter by organizer user ID.
- **meeting_start_from** (optional): Meeting start time range from (Unix timestamp).
- **meeting_start_to** (optional): Meeting start time range to (Unix timestamp).
- **limit** (optional): Number of results (default: 20).

## Output

Returns list of admin meetings with total count.
