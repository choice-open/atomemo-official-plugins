# List permanent materials (`wechat-work-list-permanent-materials`)

Calls `POST /cgi-bin/material/batchget_material` to get a list of permanent materials from WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **type** (required): Material type: "image", "video", "voice", "file"
- **offset** (optional): Starting position, default is 0
- **count** (optional): Number of items to return, default is 20, max is 20

## Output

Returns `{ total_count, items }` where items contain:
- **media_id**: Media ID of the material
- **name**: Material name
- **update_time**: Last update timestamp
- **tags**: Associated tags
- **url**: URL for image materials

## Pagination

Use `offset` and `count` for pagination. Each request can return up to 20 items.
