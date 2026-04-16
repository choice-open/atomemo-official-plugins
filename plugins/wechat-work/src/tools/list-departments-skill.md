# List departments (`wechat-work-list-departments`)

Calls `GET /department/simplelist` to retrieve the simplified department list (id, parentid, order).

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work` (OAuth2 `client_credentials`: client_id + client_secret, Hub-managed access_token).
- **parent_department_id** (optional): When set, scopes to that parent department; when empty, behavior follows enterprise default (often full tree).

## Output

Returns `{ department_id: Array<{ id, parentid, order }> }` on success.
