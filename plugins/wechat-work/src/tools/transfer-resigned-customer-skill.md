# Transfer resigned customer (`wechat-work-transfer-resigned-customer`)

Calls `POST /cgi-bin/externalcontact/resign/transfer_customer` to transfer customers from a resigned member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **handover_userid** (required): Userid of the resigned member.
- **takeover_userid** (required): Userid of the new owner.
- **transfer_strategy** (optional): Transfer strategy: force, default, not_force.

## Output

Returns the transfer result.