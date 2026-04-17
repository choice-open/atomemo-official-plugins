# List tags (`wechat-work-list-tags`)

Calls `GET /tag/list` to retrieve the tag list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`

## Output

Returns `{ taglist: Array<{ tagid, tagname, etc }> }` on success.