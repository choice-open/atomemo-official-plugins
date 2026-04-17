# Get customer service qrcode (`wechat-work-get-customer-service-qrcode`)

Calls `POST /cgi-bin/externalcontact/intelligence/get_qrcode` to get the customer service qrcode/link.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **type** (required): Type (1: qrcode, 2: link).
- **scene** (optional): Scene (1: single, 2: group).
- **way_id** (optional): Contact way ID.

## Output

Returns the qrcode or link URL.