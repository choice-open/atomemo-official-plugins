# Get health report status (`wechat-work-get-health-report`)

Calls `POST /cgi-bin/school/health/get_report` to get health report status.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **report_id** (required): Health report ID
- **school_id** (required): School ID from education management console

## Output

Returns health report status, including submissions list, submission count, etc.