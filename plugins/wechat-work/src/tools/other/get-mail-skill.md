# Get mail (`wechat-work-get-mail`)

Calls `GET /cgi-bin/mail/get` to get email details.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **mailid** (required): Mail ID from the list.

## Output

Returns the full email details including body and attachments.