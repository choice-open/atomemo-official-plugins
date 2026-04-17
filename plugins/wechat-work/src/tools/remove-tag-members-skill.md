# Remove tag members (`wechat-work-remove-tag-members`)

Calls `POST /tag/deltagusers` to remove members from a tag.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **tagid** (required): Tag ID
- **users** (required): User IDs (pipe-separated, e.g., "zhangsan|lisi")
- **parties** (optional): Department IDs (pipe-separated)

## Output

Returns `{ errcode: number, errmsg: string, invaliduser, invalidparty }` on success.