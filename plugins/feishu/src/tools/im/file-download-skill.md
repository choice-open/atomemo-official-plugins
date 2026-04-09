# Feishu IM File Download Tool Documentation

## Tool

- **Name**: `feishu_im_file_download`
- **Skill**: `im.file.download`
- **SDK**: `client.im.file.get`
- **Purpose**: 调用 `im.file.get` 下载文件。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `file_key` | `string` | `true` | `input` | 文件 Key（path）。 | "file_xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Download file by file_key

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "file_key": "file_v2_xxx"
  }
}
```

### Example 2: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"file_key\":\"file_xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_file_download",
  "tool": "feishu_im_file_download",
  "payload_raw": "{\"path\":{\"file_key\":\"file_v2_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"file_key\":\"file_v2_xxx\",\"file_name\":\"document.pdf\",\"file_size\":1024}}"
}
```

### Error Response - File Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_im_file_download",
  "tool": "feishu_im_file_download",
  "payload_raw": "{\"path\":{\"file_key\":\"file_invalid\"}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"file not found\",\"data\":{}}"
}
```

## Usage Notes

- 返回文件的元信息（文件名、大小等），实际文件内容需要通过其他方式获取
- `file_key` 通常来自消息中的文件或上传文件的返回值