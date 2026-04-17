# Get transfer result (`wechat-work-get-transfer-result`)

Calls `GET /cgi-bin/externalcontact/transfer_result` to get the result of on-job customer transfer.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **handover_userid** (required): Userid of the original owner.
- **takeover_userid** (required): Userid of the new owner.
- **cursor** (optional): Cursor for pagination.
- **limit** (optional): Limit for results (default 100).

## Output

Returns the transfer result list.