# Batch sync members (`wechat-work-batch-sync-user`)

Calls `POST /cgi-bin/batch/syncuser` to incrementally sync members to WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **media_id** (required): Media ID of the file containing member data (via file upload).
- **to_invite** (optional): Whether to send invitation to new members (true/false).
- **callback** (optional): Callback URL for async result notification.

## Output

Returns job_id for tracking the task.