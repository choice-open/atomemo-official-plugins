# Get report details (`wechat-work-get-report`)

Calls `GET /cgi-bin/report/get` to get detailed information for a specific report.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **report_id** (required): The ID of the report to get.

## Output

Returns detailed report information including title, creator_userid, create_time, content, and attachments.