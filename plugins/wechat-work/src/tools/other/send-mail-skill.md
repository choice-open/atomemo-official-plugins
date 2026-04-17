# Send mail (`wechat-work-send-mail`)

Calls `POST /cgi-bin/mail/send` to send an email via WeChat Work email service.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **to** (required): Array of recipients `[{userid: string}]` or `[{email: string}]`.
- **cc** (optional): CC recipients array.
- **bcc** (optional): BCC recipients array.
- **title** (required): Email subject.
- **content** (required): Email body (HTML supported).
- **media_id** (optional): Attachment media ID from material upload.

## Output

Returns the message ID.