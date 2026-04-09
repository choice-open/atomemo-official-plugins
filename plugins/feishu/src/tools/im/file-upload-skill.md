# Feishu IM File Upload Tool Documentation

## Tool

- **Name**: `feishu_im_file_upload`
- **Skill**: `im.file.upload`
- **SDK**: `client.im.file.create`
- **Purpose**: 调用 `im.file.create` 上传文件。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Upload file from path

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"file\":\"/path/to/document.pdf\",\"file_name\":\"document.pdf\",\"file_type\":\"pdf\"}"
  }
}
```

### Example 2: Upload Excel file

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"file\":\"/tmp/report.xlsx\",\"file_name\":\"report.xlsx\",\"file_type\":\"xlsx\"}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"file\":\"/tmp/data.csv\",\"file_name\":\"data.csv\",\"file_type\":\"csv\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_file_upload",
  "tool": "feishu_im_file_upload",
  "payload_raw": "{\"data\":{\"file\":\"/path/to/file.pdf\",\"file_name\":\"file.pdf\",\"file_type\":\"pdf\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"file_key\":\"file_v2_xxx\"}}"
}
```

### Error Response - File not found

```json
{
  "message": "Feishu API invoked successfully: feishu_im_file_upload",
  "tool": "feishu_im_file_upload",
  "payload_raw": "{\"data\":{\"file\":\"/invalid/path.pdf\"}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"file not found\",\"data\":{}}"
}
```

### Error Response - File size exceeded

```json
{
  "message": "Feishu API invoked successfully: feishu_im_file_upload",
  "tool": "feishu_im_file_upload",
  "payload_raw": "{\"data\":{\"file\":\"/path/to/large.pdf\"}}",
  "response_raw": "{\"code\":99991405,\"msg\":\"file size exceeds limit (100MB)\",\"data\":{}}"
}
```

## Usage Notes

- 上传的文件可用于发送消息（msg_type: file, content: {"file_key": "xxx"}）
- 支持的文件类型：doc、docx、xls、xlsx、ppt、pptx、pdf、txt、csv、zip、rar 等
- 文件大小限制：100MB
- `file_key` 可用于后续发送消息时引用文件