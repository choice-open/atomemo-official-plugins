# 上传图片 Tool Documentation

## Tool

- **Name**: `feishu-im_upload_image`
- **Module**: `im`
- **Method**: `POST`（SDK：`im.image.create`，multipart）
- **Path**: `/open-apis/im/v1/images`
- **Purpose**: 本接口用于将图片上传至飞书开放平台。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/image/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `image`：`file_ref`（必填）。待上传图片，与 Atomemo `PropertyFileReference`（`type: "file_ref"`）一致；由上游步骤或本地上传提供。读取方式与 `google-drive-upload-file` 相同：`parseFileRef` 后统一 `download` 取得字节再上传至飞书。
- `image_type`（可选）：`message` | `avatar`，默认 `message`。`message` 用于聊天消息图片；`avatar` 用于头像。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "image": "<file_ref from upstream or picker>",
    "image_type": "message"
  }
}
```

## Tool Output 示例

与飞书 SDK `im.image.create` 返回一致，通常包含 `image_key`：

```json
{
  "image_key": "img_v2_xxx"
}
```
