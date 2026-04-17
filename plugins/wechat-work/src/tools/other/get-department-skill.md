# Get department (`wechat-work-get-department`)

Calls `GET /cgi-bin/department/get` to get detailed information for a single department.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **department_id** (required): The ID of the department to get.

## Output

Returns detailed department information including name, parentid, order, and optionally name_en and department_leader.
