# Delete department (`wechat-work-delete-department`)

Calls `GET /department/delete` to delete a department.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **id** (required): Department ID to delete

## Output

Returns `{ errcode: number, errmsg: string }` on success (errcode=0).