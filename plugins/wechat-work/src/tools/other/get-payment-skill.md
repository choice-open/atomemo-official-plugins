# Get payment details (`wechat-work-get-payment`)

Calls `GET /cgi-bin/school/payment/get` to get payment collection details.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **payment_id** (required): Payment collection ID
- **school_id** (required): School ID from education management console

## Output

Returns payment details including status, pay info, etc.