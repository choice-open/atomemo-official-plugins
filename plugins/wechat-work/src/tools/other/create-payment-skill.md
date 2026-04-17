# Create class payment (`wechat-work-create-payment`)

Calls `POST /cgi-bin/school/payment/create` to create a class payment collection.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): School ID from education management console
- **title** (required): Payment collection title
- **amount** (required): Payment amount in cents
- **description** (optional): Payment description

## Output

Returns payment_id on success.