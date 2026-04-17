# Check message audit (`wechat-work-check-msgaudit`)

Calls `POST /msgaudit/check` to enable message audit (conversation archiving) for a member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **userid** (required): Member's userid to enable audit for

## Output

Returns audit status on success.