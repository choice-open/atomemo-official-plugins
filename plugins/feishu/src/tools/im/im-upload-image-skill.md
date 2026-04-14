# 上传图片 Tool Documentation

## Tool

- **Name**: `feishu-im_upload_image`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/images`
- **Purpose**: 本接口用于将图片上传至飞书开放平台。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/image/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"image_type\":\"message\",\"image\":\"<binary-or-file-ref>\"}"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "image_key": "img_v2_xxx"
  }
}
```
