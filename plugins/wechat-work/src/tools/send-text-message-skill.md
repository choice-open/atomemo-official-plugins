# Send text message (`wechat-work-send-text-message`)

Calls `POST /message/send` with `msgtype: text` for a self-built application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): Numeric AgentId of the app.
- **touser** (required): Recipient userids separated by `|`.
- **content** (required): Plain text body.

## Output

Returns `msgid` and optional invalid user/party/tag fields when the API reports partial delivery issues.
