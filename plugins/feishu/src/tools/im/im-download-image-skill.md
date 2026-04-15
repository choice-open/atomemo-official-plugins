# 下载图片 Tool Documentation

## Tool

- **Name**: `feishu-im_download_image`
- **Module**: `im`
- **Method**: `GET`
- **Path**: `/open-apis/im/v1/images/{image_key}`
- **Purpose**: 本接口用于通过图片的 Key 值下载图片。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/image/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `image_key`：图片 Key（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "image_key": "img_v2_xxx"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```
