# Upload file to WeDrive (`wechat-work-upload-wedrive-file`)

Calls `POST /cgi-bin/wedrive/file_upload` to upload a file to WeDrive.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **space_id** (required): The ID of the WeDrive space.
- **parent_folder_id** (optional): The ID of the folder to upload to (root if not provided).
- **file_content** (required): Base64 encoded file content.
- **file_name** (required): The name of the file.

## Output

Returns file_id and file_name.