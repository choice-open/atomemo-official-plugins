# Send file message (`wechat-work-send-file`)

Calls `POST /message/send` with msgtype "file" to send a file message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **touser** (required): Recipient userids (pipe-separated)
- **media_id** (required): Media ID (uploaded via `media/media_upload`)

## Output

Returns `{ msgid, invaliduser, invalidparty, invalidtag }` on success.