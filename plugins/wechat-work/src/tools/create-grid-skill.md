# Create grid (`wechat-work-create-grid`)

Calls `POST /report/grid/add` to create a new grid for government-citizen communication.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **grid_name** (required): Grid name (max 30 characters)
- **grid_parent_id** (required): Parent grid ID (max 10 levels)
- **grid_admin** (required): Comma-separated admin userids (at least 1, max 20)
- **grid_member** (optional): Comma-separated member userids (max 100)

## Output

Returns `{ grid_id: string, invalid_userids: string[] }` on success.
