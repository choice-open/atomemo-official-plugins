# Create live (`wechat-work-create-live`)

Calls `POST /cgi-bin/live/create` to create a live broadcast.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **title** (required): Live broadcast title
- **start_time** (required): Start Unix timestamp
- **end_time** (required): End Unix timestamp
- **anchor_userid** (required): The host's userid
- **description** (optional): Live broadcast description

## Output

Returns live_id on success.