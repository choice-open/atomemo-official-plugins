# 下载文件 Tool Documentation

## Tool

- **Name**: `feishu-im_download_file`
- **Module**: `im`
- **Method**: `GET`
- **Path**: `/open-apis/im/v1/files/{file_key}`
- **Purpose**: 本接口用于通过文件的 Key 下载文件。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/file/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `file_key`：文件 Key（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "file_key": "file_v2_xxx"
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
