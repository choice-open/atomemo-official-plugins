# Create mail group (`wechat-work-create-mail-group`)

Calls `POST /cgi-bin/mail/group/create` to create a new mail group.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **name** (required): Mail group name.
- **user_list** (optional): Array of member user IDs.
- **department_list** (optional): Array of department IDs.

## Output

Returns the created group ID.