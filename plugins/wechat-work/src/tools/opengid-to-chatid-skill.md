# Convert openid to chatid (`wechat-work-opengid-to-chatid`)

Calls `POST /cgi-bin/externalcontact/groupchat/opengid_to_chatid` to convert WeChat openid to customer group chatid.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **opengid** (required): OpenID of the customer group chat.

## Output

Returns the converted chat_id.