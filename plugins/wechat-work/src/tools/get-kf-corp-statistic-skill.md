# Get KF corp statistic (`wechat-work-get-kf-corp-statistic`)

Calls `POST /cgi-bin/kf/get_corp_statistic` to get customer service enterprise statistics.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).

## Output

Returns the statistics data.