# Transfer KF service state (`wechat-work-transfer-kf-service-state`)

Calls `POST /cgi-bin/kf/service_state/trans` to transfer or finish a customer service conversation.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **openid** (required): Openid of the user.
- **action** (required): Action type: transfer, finish.
- **kf_id** (required for transfer): Target KF account ID.
- **service_state** (optional): New service state (1: 接待中, 2:  已结束).
- **reason** (optional): Transfer reason.

## Output

Returns the result.