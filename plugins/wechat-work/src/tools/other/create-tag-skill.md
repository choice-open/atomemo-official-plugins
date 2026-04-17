# Create tag (`wechat-work-create-tag`)

Calls `POST /tag/create` to create a new tag.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **tagname** (required): Tag name
- **tagid** (optional): Custom tag ID

## Output

Returns `{ errcode: number, errmsg: string }` on success.