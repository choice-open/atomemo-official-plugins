# Create WeDrive space (`wechat-work-create-space`)

Calls `POST /cgi-bin/wedrive/space_create` to create a new WeDrive space.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **space_name** (required): The name of the WeDrive space to create.
- **space_owner_userid** (required): The user ID who will own this space.

## Output

Returns the created space_id.