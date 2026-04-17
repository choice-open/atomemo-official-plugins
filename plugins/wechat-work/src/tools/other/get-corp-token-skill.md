# Get downstream corp token (`wechat-work-get-corp-token`)

Calls `POST /cgi-bin/corpgroup/corp/gettoken` to get an access token for a downstream enterprise.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **corpid** (required): The downstream enterprise's CorpID.
- **agent_id** (required): The agent ID shared with the downstream enterprise.

## Output

Returns access token for the downstream enterprise:
- **access_token**: Access token for downstream corp API calls
- **expires_in**: Token validity duration in seconds
