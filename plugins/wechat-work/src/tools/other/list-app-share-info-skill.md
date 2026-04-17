# List app share info (`wechat-work-list-app-share-info`)

Calls `POST /cgi-bin/corpgroup/corp/list_app_share_info` to get the list of apps shared with downstream enterprises.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): The agent ID to query.

## Output

Returns list of shared apps with agent details:
- **agentid**: Shared app agent ID
- **name**: App name
- **logo_url**: App logo URL
