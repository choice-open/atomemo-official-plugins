# Get customer moment content (`wechat-work-get-moment-content`)

Calls `POST /cgi-bin/externalcontact/get_moment_list` to get the content of customer moments.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **creator** (optional): Creator userid filter.
- **filter_type** (optional): Moment type (0: enterprise, 1: personal, 2: all).
- **cursor** (optional): Pagination cursor from previous response.
- **limit** (optional): Maximum number of records to return (max: 20, default: 20).

## Output

Returns the list of moment contents including text, images, videos, links, and location.
