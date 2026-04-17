# Delete kf serving (`wechat-work-delete-kf-serving`)

Calls `POST /cgi-bin/kf/serving/del` to remove a customer service representative.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **account_id** (required): Customer service account ID.
- **userid** (required): User ID to remove.

## Output

Returns success status with account_id and userid.
