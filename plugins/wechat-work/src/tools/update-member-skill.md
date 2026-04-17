# Update member (`wechat-work-update-member`)

Calls `POST /user/update` to update an existing member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **userid** (required): Member's userid
- **name** (optional): New name
- **mobile** (optional): New mobile
- **email** (optional): New email
- **department** (optional): New department IDs (comma-separated)
- **position** (optional): New position
- **gender** (optional): "1" male, "2" female

## Output

Returns `{ errcode: number, errmsg: string }` on success.