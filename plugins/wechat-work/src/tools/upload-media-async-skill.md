# Upload media async (`wechat-work-upload-media-async`)

Calls `POST /cgi-bin/media/upload_by_url` to asynchronously upload large media files (up to 200MB) to WeChat Work via CDN URL.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **type** (required): Media type: "video" (200MB, MP4) or "file" (200MB)
- **filename** (required): Original filename with extension (max 128 bytes)
- **url** (required): CDN URL of the file (must support Range download, max 1024 bytes)
- **md5** (required): MD5 hash of the file (32 bytes)
- **scene** (optional): Scene value. Currently only supports 1 (customer contact group welcome message). Default: 1
- **wait_for_result** (optional): Whether to wait for the async upload to complete. Default: false

## Output

If `wait_for_result` is false, returns:
- **jobid**: Task ID for querying result later

If `wait_for_result` is true, returns:
- **jobid**: Task ID
- **media_id**: Media file ID (valid for 3 days)
- **created_at**: Upload timestamp

## Notes

- The CDN URL must support Range download (分块下载)
- If using Tencent Cloud COS link, ensure it has "public read" permissions
- Media ID is valid for only 3 days
- Media ID can be shared between applications within the same enterprise
- If file size exceeds 20MB when getting the media, must use Range download with chunk size not exceeding 20MB
