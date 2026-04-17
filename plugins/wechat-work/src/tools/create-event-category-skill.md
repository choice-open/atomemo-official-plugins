# Create event category (`wechat-work-create-event-category`)

Calls `POST /report/grid/add_cata` to create a new event category for reports.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **category_name** (required): Category name (max 30 characters)
- **level** (required): Category level (1 for top-level, 2 for sub-category)
- **parent_category_id** (optional): Required for level 2 categories (parent category ID)

## Output

Returns `{ category_id: string }` on success.
