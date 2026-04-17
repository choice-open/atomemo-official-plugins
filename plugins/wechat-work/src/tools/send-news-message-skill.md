# Send news message (`wechat-work-send-news`)

Calls `POST /message/send` with msgtype "news" to send a news/article message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **touser** (required): Recipient userids (pipe-separated)
- **articles** (required): JSON array of articles with title, description, url, picurl

## Output

Returns `{ msgid, invaliduser, invalidparty, invalidtag }` on success.