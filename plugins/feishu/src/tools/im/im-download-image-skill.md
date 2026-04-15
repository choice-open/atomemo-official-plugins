# 下载图片 Tool Documentation

## Tool

- **Name**: `feishu-im_download_image`
- **Module**: `im`
- **Method**: `GET`（SDK：`im.image.get`，二进制流）
- **Path**: `/open-apis/im/v1/images/{image_key}`
- **Purpose**: 通过 `image_key` 下载应用自身上传且类型为 `message` 的图片，并写入 Atomemo 文件系统，返回可在工作流中复用的 `file_ref`（`PropertyFileReference` / `type: "file_ref"`）。
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

与 `google-drive-download-file` 一致：直接返回 `context.files.upload` 的结果（`file_ref` 对象），供下游步骤引用。

```json
{
  "__type__": "file_ref",
  "filename": "img_v2_xxx.png",
  "mime_type": "image/png",
  "content": "<base64 omitted>"
}
```
