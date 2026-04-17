# List patrol records (`wechat-work-list-patrol-records`)

Calls `POST /report/patrol/get_order_list` to retrieve patrol inspection records.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **begin_create_time** (optional): Filter reports created after this timestamp
- **begin_modify_time** (optional): Filter reports modified after this timestamp
- **cursor** (optional): Pagination cursor (empty for first page)
- **limit** (optional): Number of records per page (default 20, max 50)

## Output

Returns `{ next_cursor: string, order_list: Array<{ order_id, desc, urge_type, case_name, grid_id, grid_name, create_time, image_urls, video_media_ids, location }> }` on success.
