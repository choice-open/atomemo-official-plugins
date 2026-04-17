# Transfer customer group (`wechat-work-transfer-customer-group`)

Calls `POST /cgi-bin/externalcontact/grouptransfer/transfer_customer` to transfer a customer group from one member to another.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **chat_id** (required): Customer group chat_id.
- **new_owner** (required): Userid of the new owner.
- **transfer_ownership** (optional): Whether to transfer ownership (true/false).

## Output

Returns success status.