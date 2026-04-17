# Set application menu (`wechat-work-set-menu`)

Calls `POST /menu/create` to set the custom menu for an application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **menu** (required): JSON object of menu configuration

## Output

Returns `{ errcode: number, errmsg: string }` on success.