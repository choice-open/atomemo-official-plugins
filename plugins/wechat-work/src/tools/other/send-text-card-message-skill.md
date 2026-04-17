# Send text card message (`wechat-work-send-text-card-message`)

Calls `POST /cgi-bin/message/send` with `msgtype: textcard`.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): Numeric AgentId of the app.
- **touser** (optional): Recipient userids separated by `|`.
- **toparty** (optional): Recipient partyids separated by `|`.
- **totag** (optional): Recipient tagids separated by `|`.
- **title** (required): Text card title (max 128 characters).
- **description** (required): Text card description (max 512 characters).
- **url** (required): Click redirect URL.
- **btn_txt** (optional): Button text (max 100 characters).

## Output

Returns `msgid` and optional invalid fields.