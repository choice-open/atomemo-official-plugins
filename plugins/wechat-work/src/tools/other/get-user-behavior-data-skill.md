# Get user behavior data (`wechat-work-get-user-behavior-data`)

Calls `POST /cgi-bin/externalcontact/get_user_behavior_data` to get member customer behavior data.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **userid** (optional): Userid to filter (if not provided, returns all).
- **limit** (optional): Limit for results (default 1000).

## Output

Returns the behavior data for each user.