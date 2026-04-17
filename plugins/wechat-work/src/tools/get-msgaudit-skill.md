# Get message audit content (`wechat-work-get-msgaudit`)

Calls `POST /msgaudit/get` to retrieve conversation archiving content.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **limit** (optional): Number of messages to retrieve (default 1000)

## Output

Returns conversation list with messages on success.