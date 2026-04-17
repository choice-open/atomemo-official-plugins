# Get WeDrive space info (`wechat-work-get-space-info`)

Calls `POST /cgi-bin/wedrive/space_info` to get detailed information for a WeDrive space.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **space_id** (required): The ID of the WeDrive space.

## Output

Returns detailed space information including space_name, space_owner_userid, space_desc, total_size, used_size, and file_count.