# Get batch result (`wechat-work-get-batch-result`)

Calls `GET /cgi-bin/batch/getresult` to get the result of an async batch task.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **job_id** (required): Job ID returned from batch sync/replace API.

## Output

Returns the task result, including status and data.