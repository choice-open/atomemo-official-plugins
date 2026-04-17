# Delete tag (`wechat-work-delete-tag`)

Calls `GET /tag/delete` to delete a tag.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **tagid** (required): Tag ID to delete

## Output

Returns `{ errcode: number, errmsg: string }` on success.