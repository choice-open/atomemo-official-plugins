# Add customer moment task (`wechat-work-add-moment-task`)

Calls `POST /cgi-bin/externalcontact/add_moment_task` to create a customer moment publish task.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **text_content** (optional): Text message content (max 2000 chars). Either this or attachment is required.
- **msgtype** (optional): Attachment type (image/video/link).
- **media_id** (required when msgtype is set): Media ID of the attachment.
- **link_title** (optional): Title of the link when msgtype is "link".
- **link_url** (required when msgtype is "link"): URL of the link.
- **user_list** (optional): Comma-separated list of sender user IDs.
- **department_list** (optional): Comma-separated list of sender department IDs.
- **external_contact_tag_list** (optional): Comma-separated list of external contact tag IDs for visible customers.

## Output

Returns the job ID for the async task. Use `get_moment_task_result` to check the status.
