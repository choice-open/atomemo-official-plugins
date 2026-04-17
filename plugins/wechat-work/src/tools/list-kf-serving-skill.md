# List kf serving (`wechat-work-list-kf-serving`)

Calls `GET /cgi-bin/kf/serving/list` to list customer service representatives.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **account_id** (required): Customer service account ID.

## Output

Returns an array of representative objects with userid and status.
