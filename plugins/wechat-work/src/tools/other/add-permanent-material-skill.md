# Add permanent material (`wechat-work-add-permanent-material`)

Calls `POST /cgi-bin/material/add_material` to upload permanent material (image, video, file) to WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **type** (required): Material type: "image", "video", "file"
- **file_url** (required): URL of the file to upload
- **filename** (required): Original filename with extension
- **title** (optional): Title for video material (required for video)
- **introduction** (optional): Introduction for video material (required for video)

## Size Limits

- **image**: Max 10MB, JPG/PNG
- **video**: Max 10MB, MP4, requires title and introduction
- **file**: Max 20MB, any format

## Output

Returns `{ media_id, url }` on success.

**Note**: Permanent materials do not expire and are stored permanently in WeChat Work.
