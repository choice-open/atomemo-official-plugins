# Send voice message (`wechat-work-send-voice`)

Calls `POST /message/send` with msgtype "voice" to send a voice message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **touser** (required): Recipient userids (pipe-separated)
- **media_id** (required): Media ID (uploaded via `media/media_upload`)

## Output

Returns `{ msgid, invaliduser, invalidparty, invalidtag }` on success.