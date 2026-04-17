# List kf accounts (`wechat-work-list-kf-accounts`)

Calls `GET /cgi-bin/kf/account/list` to list all customer service accounts.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.

## Output

Returns an array of account objects with id, name, avatar, and status.
