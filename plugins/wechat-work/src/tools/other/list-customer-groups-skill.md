# List customer groups (`wechat-work-list-customer-groups`)

Calls `GET /externalcontact/groupchat/list` to get the list of customer groups (群聊).

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **limit** (optional): Number of results per page (default: 1000)
- **cursor** (optional): Cursor for pagination

## Output

Returns `{ errcode, errmsg, group_list, next_cursor }` on success.