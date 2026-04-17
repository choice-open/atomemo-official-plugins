# Export health report data (`wechat-work-export-health-report`)

Calls `POST /cgi-bin/school/health/export_report` to export health report data.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **report_id** (required): Health report ID
- **school_id** (required): School ID from education management console

## Output

Returns a download URL for the exported file.