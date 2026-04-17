# Send markdown message (`wechat-work-send-markdown`)

Calls `POST /message/send` with msgtype "markdown" to send a markdown message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **agent_id** (required): Application AgentId
- **touser** (required): Recipient userids (pipe-separated)
- **content** (required): Markdown content

## Output

Returns `{ msgid, invaliduser, invalidparty, invalidtag }` on success.