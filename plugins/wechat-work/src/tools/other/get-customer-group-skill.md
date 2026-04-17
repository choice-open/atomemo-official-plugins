# Get customer group (`wechat-work-get-customer-group`)

Calls `POST /cgi-bin/externalcontact/groupchat/get` to get detailed information of a customer group chat.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **chat_id** (required): The chat ID of the customer group.

## Output

Returns detailed customer group information including name, owner, member list, and other metadata.
