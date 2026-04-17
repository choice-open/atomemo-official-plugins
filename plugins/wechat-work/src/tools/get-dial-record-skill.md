# Get dial record (`wechat-work-get-dial-record`)

Calls `POST /cgi-bin/dial/get_dial_record` to retrieve dial records within a specified time range.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (optional): Query start time as Unix timestamp.
- **end_time** (optional): Query end time as Unix timestamp.
- **offset** (optional): Pagination offset.
- **limit** (optional): Number of records per page (default 100, max 100).

## Output

Returns an array of dial records, each containing:
- **call_time**: Call timestamp
- **total_duration**: Total call duration in minutes
- **call_type**: Call type (1: single call, 2: group call)
- **caller**: Caller information (userid, phone, duration)
- **callee**: Array of callee information (userid, phone, duration)

## Notes

- Query time range [start_time, end_time] is inclusive.
- Maximum time span is 30 days.
- If no time range is specified, defaults to last 30 days.
