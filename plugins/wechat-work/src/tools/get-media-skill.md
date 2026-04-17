# Get media file (`wechat-work-get-media`)

Calls `GET /cgi-bin/media/get` to download temporary media files.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **media_id** (required): Media ID of the file to download.

## Supported Media Types

- **image**: jpg, png, default format
- **voice**: amr, mp3, speex
- **video**: mp4
- **file**: any format

## Output

Returns the media file as base64 encoded data or file URL.

**Note**: Temporary media files expire after 3 days.
