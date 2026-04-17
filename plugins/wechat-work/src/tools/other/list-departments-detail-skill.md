# List department details (`wechat-work-list-departments-detail`)

Calls `GET /department/list` to retrieve the full department list with names.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work` (OAuth2 `client_credentials`: client_id + client_secret, Hub-managed access_token).
- **parent_department_id** (optional): When set, scopes to that parent department; when empty, returns full tree.

## Output

Returns `{ department: Array<{ id, name, parentid, order }> }` on success.