# List school departments (`wechat-work-list-school-departments`)

Calls `GET /school/department/list` to retrieve the list of departments (classes) in a school.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): The school ID
- **parent_department_id** (optional): Filter by parent department ID (leave empty for root)
- **fetch_child** (optional): Whether to recursively fetch child departments

## Output

Returns `{ departments: Array<{ id, name, parentid, order }> }` on success.
