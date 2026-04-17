# Transfer customer (`wechat-work-transfer-customer`)

Calls `POST /cgi-bin/externalcontact/transfer_customer` to transfer customers from one member to another (on-job transfer).

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **handover_userid** (required): Userid of the original owner.
- **takeover_userid** (required): Userid of the new owner.
- **external_userid** (optional): JSON array of external userids to transfer (max 100).
- **transfer_success_ratio** (optional): Success transfer ratio (1-100).

## Output

Returns the transfer result and pending list.