# 下载文件 Tool Documentation

## Tool

- **Name**: `feishu-im_download_file`
- **Module**: `im`
- **Method**: `GET`（SDK：`im.file.get`，二进制流）
- **Path**: `/open-apis/im/v1/files/{file_key}`
- **Purpose**：通过 `file_key` 下载机器人自行上传的文件，写入 Atomemo 并返回 `file_ref`（与 `feishu-im_download_image` 一致：直接返回 `context.files.upload` 的结果）。
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

直接返回 `file_ref` 对象（与下载图片 / Google Drive 下载一致）：

```json
{
  "__type__": "file_ref",
  "filename": "file_v2_xxx.pdf",
  "mime_type": "application/pdf",
  "content": "<base64 omitted>"
}
```
