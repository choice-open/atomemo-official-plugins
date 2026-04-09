# Feishu IM Image Upload Tool Documentation

## Tool

- **Name**: `feishu_im_image_upload`
- **Skill**: `im.image.upload`
- **SDK**: `client.im.image.create`
- **Purpose**: 调用 `im.image.create` 上传图片。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Upload image from file path

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"image\":\"/path/to/image.png\",\"image_type\":\"png\"}"
  }
}
```

### Example 2: Upload image by image_key (re-upload existing)

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"image_key\":\"img_xxx\"}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"image\":\"/tmp/photo.jpg\",\"image_type\":\"jpg\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_image_upload",
  "tool": "feishu_im_image_upload",
  "payload_raw": "{\"data\":{\"image\":\"/path/to/image.png\",\"image_type\":\"png\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"image_key\":\"img_v2_xxx\"}}"
}
```

### Error Response - File not found

```json
{
  "message": "Feishu API invoked successfully: feishu_im_image_upload",
  "tool": "feishu_im_image_upload",
  "payload_raw": "{\"data\":{\"image\":\"/invalid/path.png\",\"image_type\":\"png\"}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"file not found\",\"data\":{}}"
}
```

### Error Response - Invalid image format

```json
{
  "message": "Feishu API invoked successfully: feishu_im_image_upload",
  "tool": "feishu_im_image_upload",
  "payload_raw": "{\"data\":{\"image\":\"/path/to/file.txt\",\"image_type\":\"txt\"}}",
  "response_raw": "{\"code\":99991404,\"msg\":\"unsupported image format\",\"data\":{}}"
}
```

## Usage Notes

- 上传的图片可用于发送消息（msg_type: image, content: {"image_key": "xxx"}）
- 支持的图片格式：PNG、JPG、GIF、BMP、WebP
- 图片大小限制：10MB
- `image_key` 可用于后续发送消息时引用图片