# Send KF message (`wechat-work-send-kf-message`)

Calls `POST /cgi-bin/kf/send_msg` to send a customer service message.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **openid** (required): Openid of the user.
- **msgtype** (required): Message type: text, image, voice, video, file, link, miniprogram, msgmenu.
- **content** (required): Message content (text: string, others: JSON).

## Output

Returns the message ID.