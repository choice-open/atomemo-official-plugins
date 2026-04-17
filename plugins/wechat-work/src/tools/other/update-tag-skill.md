# Update tag (`wechat-work-update-tag`)

Calls `POST /tag/update` to update a tag.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **tagid** (required): Tag ID
- **tagname** (optional): New tag name

## Output

Returns `{ errcode: number, errmsg: string }` on success.