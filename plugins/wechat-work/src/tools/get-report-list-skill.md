# Get report list (`wechat-work-get-report-list`)

Calls `GET /cgi-bin/report/get_list` to get a list of reports within a time range.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **starttime** (required): Start timestamp (Unix seconds).
- **endtime** (required): End timestamp (Unix seconds).

## Output

Returns report_list and total_count.