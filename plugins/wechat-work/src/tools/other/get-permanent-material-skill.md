# Get permanent material (`wechat-work-get-permanent-material`)

Calls `GET /cgi-bin/material/get` to download permanent material files from WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **media_id** (required): Media ID of the permanent material to download

## Supported Material Types

- **image**: jpg, png
- **video**: mp4
- **voice**: amr, mp3
- **file**: any format

## Output

Returns the material file as base64 encoded data or data URL.

**Note**: Unlike temporary media, permanent materials do not expire.
