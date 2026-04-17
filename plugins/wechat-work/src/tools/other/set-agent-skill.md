# Set agent (`wechat-work-set-agent`)

Calls `POST /cgi-bin/agent/set` to set or update a WeChat Work application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **agent_id** (required): The agentid of the application to update.
- **name** (optional): Application name (max 64 chars).
- **description** (optional): Application description (max 500 chars).
- **logo_media_id** (optional): Media ID of the logo (use media/upload to upload first).
- **redirect_domain** (optional): OAuth2 redirect domain.
- **home_url** (optional): Homepage URL.
- **isreportenter** (optional): Whether to report user enter (0/1).
- **report_location** (optional): Whether to report location (0/1).
- **is_customized_app** (optional): Whether it's a customized app (0/1).

## Output

Returns success status.