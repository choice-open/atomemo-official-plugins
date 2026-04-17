# List event categories (`wechat-work-list-event-categories`)

Calls `POST /report/grid/list_cata` to retrieve the event category list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`

## Output

Returns `{ category_list: Array<{ category_id, category_name, level, parent_category_id }> }` on success.
