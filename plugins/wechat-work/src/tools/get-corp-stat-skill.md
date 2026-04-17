# Get corp statistic (`wechat-work-get-corp-stat`)

Calls `GET /cgi-bin/externalcontact/get_corp_stat` to get enterprise customer statistics.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).

## Output

Returns the enterprise customer statistics.