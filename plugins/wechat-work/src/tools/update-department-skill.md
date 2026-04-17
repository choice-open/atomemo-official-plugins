# Update department (`wechat-work-update-department`)

Calls `POST /department/update` to update an existing department.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **id** (required): Department ID to update
- **name** (optional): New department name (max 100 chars)
- **parent_id** (optional): New parent department ID
- **order** (optional): New display order (uint32)

## Output

Returns `{ errcode: number, errmsg: string }` on success (errcode=0).