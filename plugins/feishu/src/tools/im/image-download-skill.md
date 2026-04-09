# Feishu IM Image Download Tool Documentation

## Tool

- **Name**: `feishu_im_image_download`
- **Skill**: `im.image.download`
- **SDK**: `client.im.image.get`
- **Purpose**: 调用 `im.image.get` 下载图片元信息/内容。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `image_key` | `string` | `true` | `input` | 图片 Key（path）。 | "img_xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Download image by image_key

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "image_key": "img_v2_xxx"
  }
}
```

### Example 2: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"image_key\":\"img_xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_image_download",
  "tool": "feishu_im_image_download",
  "payload_raw": "{\"path\":{\"image_key\":\"img_v2_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"image_key\":\"img_v2_xxx\",\"pic_height\":100,\"pic_width\":100}}"
}
```

### Error Response - Image Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_im_image_download",
  "tool": "feishu_im_image_download",
  "payload_raw": "{\"path\":{\"image_key\":\"img_invalid\"}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"image not found\",\"data\":{}}"
}
```

## Usage Notes

- 返回图片的元信息（宽高、格式等），实际图片内容需要通过其他方式获取
- `image_key` 通常来自消息中的图片或上传图片的返回值