# Add kf account (`wechat-work-add-kf-account`)

Calls `POST /cgi-bin/kf/account/add` to add a customer service account.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **name** (required): Account name (max 16 chars).
- **media_id** (optional): Avatar media ID.

## Output

Returns the account ID.