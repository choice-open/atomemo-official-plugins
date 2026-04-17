# List WeDrive files (`wechat-work-list-files`)

Calls `GET /cgi-bin/wedrive/file_list` to get a list of files in a WeDrive space.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **space_id** (required): The ID of the WeDrive space.
- **parent_folder_id** (optional): The ID of the folder to list (root if not provided).

## Output

Returns file_list, folder_list, and next_cursor for pagination.