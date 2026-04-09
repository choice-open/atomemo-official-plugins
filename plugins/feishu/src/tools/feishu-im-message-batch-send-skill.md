# Feishu IM Message Batch Send Tool Documentation

## Tool

- **Name**: `feishu_im_message_batch_send`
- **Skill**: `im.message.batch.send`
- **SDK**: `client.im.message.forward`
- **Purpose**: 调用 `im.message.forward` 转发/批量投递消息。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `message_id` | `string` | `true` | `input` | 源消息 ID（path）。 | "om_xxx" |
| `to_ids_json` | `string` | `false` | `input` | 目标 ID 数组 JSON（data.to_ids）。 | "[\"ou_xxx\"]" |
| `receive_id_type` | `string` | `false` | `input` | 接收者 ID 类型（params）。 | "open_id" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Forward message to users

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "message_id": "om_xxx",
    "to_ids_json": "[\"ou_user1\",\"ou_user2\",\"ou_user3\"]",
    "receive_id_type": "open_id"
  }
}
```

### Example 2: Forward to single user

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "message_id": "om_xxx",
    "receive_id_type": "open_id",
    "data_json": "{\"to_ids\":[\"ou_target\"]}"
  }
}
```

### Example 3: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"message_id\":\"om_xxx\"}",
    "params_json": "{\"receive_id_type\":\"open_id\"}",
    "data_json": "{\"to_ids\":[\"ou_1\",\"ou_2\"]}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_message_batch_send",
  "tool": "feishu_im_message_batch_send",
  "payload_raw": "{\"path\":{\"message_id\":\"om_xxx\"},\"params\":{\"receive_id_type\":\"open_id\"},\"data\":{\"to_ids\":[\"ou_1\",\"ou_2\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Message Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_im_message_batch_send",
  "tool": "feishu_im_message_batch_send",
  "payload_raw": "{\"path\":{\"message_id\":\"om_invalid\"}}",
  "response_raw": "{\"code\":99991402,\"msg\":\"message not found\",\"data\":{}}"
}
```