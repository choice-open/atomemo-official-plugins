# Revoke message (`wechat-work-revoke-message`)

Calls `POST /cgi-bin/message/revoke` to recall a previously sent application message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **msgid** (required): The message ID to revoke (returned when sending the message).

## Limitations

- Only messages sent within the last 24 hours can be revoked.
- Only text, textcard, image, voice, video, file, news, mpnews, markdown, template_card message types can be revoked.
- Cannot revoke messages that have been read.

## Output

Returns success status on successful revocation.
