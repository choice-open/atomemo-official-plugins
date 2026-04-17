# Download WeDrive file (`wechat-work-download-wedrive-file`)

Calls `GET /cgi-bin/wedrive/file_download` to download a file from WeDrive.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **file_id** (required): The ID of the file to download.

## Output

Returns file_content (base64 encoded).