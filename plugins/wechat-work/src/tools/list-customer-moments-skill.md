# List customer moments (`wechat-work-list-customer-moments`)

Calls `POST /cgi-bin/externalcontact/moment/list` to get the list of customer moments.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **creator** (optional): Creator userid filter.
- **filter_type** (optional): Filter type (0: all, 1: created by me, 2: mentioned me).

## Output

Returns the list of moments.