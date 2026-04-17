# Upload image (`wechat-work-upload-image`)

Calls `POST /cgi-bin/media/uploadimg` to upload an image and get the URL.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **media** (required): Image file to upload (base64 encoded).

## Output

Returns the image URL.