# Create member (`wechat-work-create-member`)

Calls `POST /user/create` to create a new member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **userid** (required): Member's unique userid
- **name** (required): Member's name
- **mobile** (optional): Mobile number
- **email** (optional): Email address
- **department** (optional): Department IDs (comma-separated, e.g., "1,2,3")
- **position** (optional): Job title
- **gender** (optional): "1" male, "2" female

## Output

Returns `{ errcode: number, errmsg: string }` on success.