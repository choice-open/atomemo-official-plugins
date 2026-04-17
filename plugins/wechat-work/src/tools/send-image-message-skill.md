# Send image message (`wechat-work-send-image`)

Calls `POST /message/send` with msgtype "image" to send an image message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **touser** (required): Recipient userids (pipe-separated)
- **media_id** (required): Media ID (uploaded via `material/media_upload`)

## Output

Returns `{ msgid, invaliduser, invalidparty, invalidtag }` on success.