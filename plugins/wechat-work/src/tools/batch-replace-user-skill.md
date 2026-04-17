# Batch replace members (`wechat-work-batch-replace-user`)

Calls `POST /cgi-bin/batch/replaceuser` to fully replace members in WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **media_id** (required): Media ID of the file containing member data.
- **to_invite** (optional): Whether to send invitation to new members.
- **callback** (optional): Callback URL for async result notification.
- **sync_id** (optional): Sync ID for incremental sync.

## Output

Returns job_id for tracking the task.