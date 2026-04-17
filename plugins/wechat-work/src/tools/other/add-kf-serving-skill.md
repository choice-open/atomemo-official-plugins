# Add kf serving (`wechat-work-add-kf-serving`)

Calls `POST /cgi-bin/kf/serving/add` to add a customer service representative.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **account_id** (required): Customer service account ID.
- **userid** (required): User ID to add as representative.

## Output

Returns success status with account_id and userid.
