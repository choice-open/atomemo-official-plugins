# Batch replace department (`wechat-work-batch-replace-party`)

Calls `POST /cgi-bin/batch/replaceparty` to fully replace departments in WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **media_id** (required): Media ID of the file containing department data.
- **callback** (optional): Callback URL for async result notification.

## Output

Returns job_id for tracking the task.