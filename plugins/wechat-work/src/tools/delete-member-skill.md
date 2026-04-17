# Delete member (`wechat-work-delete-member`)

Calls `GET /user/delete` to delete a member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **userid** (required): Member's userid to delete

## Output

Returns `{ errcode: number, errmsg: string }` on success.