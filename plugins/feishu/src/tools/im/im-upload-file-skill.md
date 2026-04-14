# 上传文件 Tool Documentation

## Tool

- **Name**: `feishu-im_upload_file`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/files`
- **Purpose**: 本接口用于将本地文件上传至飞书开放平台。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/file/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"file_type\":\"stream\",\"file_name\":\"example.txt\",\"file\":\"<binary-or-file-ref>\"}"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "file_key": "file_v2_xxx"
  }
}
```
