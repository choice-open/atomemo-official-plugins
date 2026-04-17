# Create department (`wechat-work-create-department`)

Calls `POST /department/create` to create a new department.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **name** (required): Department name (max 100 chars)
- **parent_id** (optional): Parent department ID (default: 1)
- **order** (optional): Display order (uint32)
- **id** (optional): Custom department ID (must be unique, uint32)

## Output

Returns `{ id: number }` on success (the created department ID).