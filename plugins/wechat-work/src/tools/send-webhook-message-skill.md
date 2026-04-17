# Send group robot message (`wechat-work-send-webhook-message`)

Calls `POST /cgi-bin/webhook/send` to send messages via a group chat robot (群机器人).

## Parameters

- **webhook_url** (required): The webhook URL of the group robot.
- **msgtype** (required): Message type (`text`, `markdown`, `image`, `news`, `file`, `textcard`, `template_card`).
- **content** (required for text): Text content.
- **markdown** (required for markdown): Markdown content.
- **media_id** (required for image/file/news): Media ID.
- **title** (optional for textcard/news): Message title.
- **description** (optional for textcard/news): Message description.
- **url** (optional for textcard/news): Link URL.
- **btntxt** (optional for textcard): Button text.

## Output

Returns `errcode` (0 for success) and `errmsg`.
