# Create automated group chat (`wechat-work-create-group-chat`)

Calls `POST /cgi-bin/smartwork/automated/groupchat/create` to create a group chat via smartsheet automation.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **scene** (required): Group chat scene (1: 内部群, 2: 互通群, 3: 客户群).
- **userids** (optional): List of userids to add.
- **mobiles** (optional): List of mobile numbers to add.
- **sync_from_group_id** (optional): Source group chat ID to sync members from.

## Output

Returns `chat_id` (the created group chat ID).
