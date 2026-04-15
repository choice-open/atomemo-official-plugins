# 上传文件 Tool Documentation

## Tool

- **Name**: `feishu-im_upload_file`
- **Module**: `im`
- **Method**: `POST`（SDK：`im.file.create`，multipart）
- **Path**: `/open-apis/im/v1/files`
- **Purpose**: 将本地/工作流文件上传至飞书开放平台（与 `feishu-im_upload_image` 相同：`file_ref` + `parseFileRef` + `download` 取字节）。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/file/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `file`：`file_ref`（必填），待上传文件。
- `file_type`（可选）：`opus` | `mp4` | `pdf` | `doc` | `xls` | `ppt` | `stream`，默认 `stream`。
- `file_name`（可选）：飞书侧显示的文件名；不填则使用 `file_ref` 自带文件名。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "file": "<file_ref from upstream or picker>",
    "file_type": "stream",
    "file_name": "report.pdf"
  }
}
```

## Tool Output 示例

与 SDK `im.file.create` 返回一致，通常包含 `file_key`：

```json
{
  "file_key": "file_v2_xxx"
}
```
