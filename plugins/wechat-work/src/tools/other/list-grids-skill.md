# List grids (`wechat-work-list-grids`)

Calls `POST /report/grid/list` to retrieve the grid list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **grid_id** (optional): Grid ID to query. Leave empty to get root nodes and their children.

## Output

Returns `{ grid_list: Array<{ grid_id, grid_name, grid_parent_id, grid_admin, grid_member }> }` on success.
