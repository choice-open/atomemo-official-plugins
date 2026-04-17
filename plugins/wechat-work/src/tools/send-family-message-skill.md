# Send family/education message (`wechat-work-send-family-message`)

Calls `POST /message/send` with `msgtype: text` for family/school education scenarios.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): Numeric AgentId of the app.
- **touser** (required): Recipient userids separated by `|` (parents/students).
- **content** (required): Plain text body.
- **school_id** (required): School ID for family/education messages.

## Output

Returns `msgid` and optional invalid user fields when the API reports partial delivery issues.
