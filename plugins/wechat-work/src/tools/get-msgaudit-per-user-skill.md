# Get member message audit (`wechat-work-get-msgaudit-per-user`)

Calls `POST /msgaudit/get_per_user` to retrieve conversation archiving content for a specific member.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **userid** (required): Member's userid to get audit content for
- **limit** (optional): Number of messages to retrieve (default 1000)

## Output

Returns conversation list with messages for the specified member on success.