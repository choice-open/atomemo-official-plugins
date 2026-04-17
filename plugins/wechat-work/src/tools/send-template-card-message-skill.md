# Send template card message (`wechat-work-send-template-card-message`)

Calls `POST /cgi-bin/message/send` with `msgtype: template_card`.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): Numeric AgentId of the app.
- **touser** (optional): Recipient userids separated by `|`.
- **toparty** (optional): Recipient partyids separated by `|`.
- **totag** (optional): Recipient tagids separated by `|`.
- **template_id** (required): Template card ID.
- **title** (optional): Card title (first priority).
- **highlight** (optional): Highlight text to show.
- **sub_title** (optional): Subtitle.
- **image_url** (optional): Image URL.
- **source_icon_url** (optional): Source icon URL.
- **source_url** (optional): Source URL.
- **buttons** (required): JSON array of buttons with action_type, title, url.

## Output

Returns `msgid` and optional invalid fields.