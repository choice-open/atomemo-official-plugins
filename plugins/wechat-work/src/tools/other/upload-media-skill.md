# Upload media (`wechat-work-upload-media`)

Calls `POST /media/upload` to upload temporary media (image, voice, video, file).

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **type** (required): Media type: "image", "voice", "video", "file"
- **file_url** (required): URL of the file to upload
- **filename** (required): Original filename

## Output

Returns `{ media_id, created_at }` on success.