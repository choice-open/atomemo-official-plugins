# Create school live (`wechat-work-create-school-live`)

Calls `POST /cgi-bin/school/live/create` to create a school live broadcast.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): School ID from education management console
- **title** (required): Live broadcast title
- **start_time** (required): Start Unix timestamp
- **end_time** (required): End Unix timestamp
- **anchor_userid** (required): The host's userid
- **description** (optional): Live broadcast description

## Output

Returns live_id on success.