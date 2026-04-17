# Get agent (`wechat-work-get-agent`)

Calls `GET /cgi-bin/agent/get` to get the details of a WeChat Work application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): The agentid of the application.

## Output

Returns application details including name, square_logo_url, description, allow_userinfos, allow_partys, etc.