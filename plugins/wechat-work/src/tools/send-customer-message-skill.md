# Send customer message (`wechat-work-send-customer-message`)

Calls `POST /cgi-bin/externalcontact/message/send` to send a message to customers.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid** (required): Userid of the staff who added the customer.
- **external_userid** (required): External contact's userid.
- **msgtype** (required): Message type (text, image, link, miniprogram, etc).
- **content** (required): Message content based on msgtype.

## Output

Returns success status.