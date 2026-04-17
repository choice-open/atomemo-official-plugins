# Send intelligent robot message (`wechat-work-send-robot-message`)

Calls `POST /cgi-bin/robot/send` to send messages via an intelligent robot.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **robot_agent_id** (required): Robot agent ID.
- **msgtype** (required): Message type (`text`, `markdown`, `image`, `news`, `file`, `textcard`, `template_card`).
- **content** (required for text): Text content.
- **msgid** (optional): Client message ID for deduplication.
- **touser** (optional): Recipient userids.
- **toparty** (optional): Recipient partyids.
- **totag** (optional): Recipient tagids.

## Output

Returns `errcode` (0 for success), `errmsg`, and `msgid`.
