# List department members (`wechat-work-list-members`)

Calls `GET /user/simplelist` to retrieve the member list in a department.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **department_id** (required): Department ID to fetch members from
- **fetch_child** (optional): "1" to fetch child departments, "0" only this dept (default: "1")

## Output

Returns `{ user: Array<{ userid, name, department, position, mobile, email, avatar, status }> }` on success.