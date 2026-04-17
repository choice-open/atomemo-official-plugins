# Cancel meeting (`wechat-work-cancel-meeting`)

Calls `POST /cgi-bin/meeting/cancel` to cancel a meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to cancel.
- **reason** (optional): Cancellation reason.

## Output

Returns success status.