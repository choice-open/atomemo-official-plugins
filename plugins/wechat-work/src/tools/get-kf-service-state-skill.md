# Get KF service state (`wechat-work-get-kf-service-state`)

Calls `POST /cgi-bin/kf/service_state/get` to get the current customer service conversation state.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **openid** (required): Openid of the user.

## Output

Returns the service state info.