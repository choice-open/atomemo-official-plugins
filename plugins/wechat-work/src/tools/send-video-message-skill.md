# Send video message (`wechat-work-send-video`)

Calls `POST /cgi-bin/message/send` with `msgtype: video` for a self-built application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): Numeric AgentId of the app.
- **touser** (optional): Recipient userids separated by `|`.
- **toparty** (optional): Recipient partyids separated by `|`.
- **totag** (optional): Recipient tagids separated by `|`.
- **media_id** (required): Media ID of the video (must be uploaded via media/upload API).
- **title** (optional): Video title (max 64 characters).
- **description** (optional): Video description (max 512 characters).

**Note**: At least one of touser, toparty, or totag is required.

## Video Requirements

- Format: MP4
- Size: Up to 10MB
- Must be uploaded via the `/cgi-bin/media/upload` API with `type=video`

## Output

Returns `msgid` and optional invalid user/party/tag fields when the API reports partial delivery issues.
