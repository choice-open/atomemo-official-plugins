# Get export result (`wechat-work-get-export-result`)

Calls `GET /cgi-bin/export/get_result` to retrieve the result of an async export task.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **job_id** (required): Job ID returned from the export API.

## Output

Returns export status and download URLs when complete:
- **status**: 1=pending, 2=processing, 3=completed, 4=failed
- **url**: Download URL for the exported file(s)
- **filename**: Name of exported file(s)
