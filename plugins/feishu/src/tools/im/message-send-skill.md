# Feishu IM Message Send Tool Documentation

## Tool

- **Name**: `feishu_im_message_send`
- **Skill**: `im.message.send`
- **SDK**: `client.im.message.create`
- **Purpose**: 调用 `im.message.create` 发送消息。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `receive_id_type` | `string` | `true` | `input` | 接收者 ID 类型（params）。支持 open_id/user_id/union_id/chat_id/email。 | "open_id" |
| `receive_id` | `string` | `true` | `input` | 接收者 ID（data）。 | "ou_xxx" |
| `msg_type` | `string` | `true` | `input` | 消息类型（data）。支持 text/post/image/file/audio/media/sticker/interactive/share_chat/share_user/system。 | "text" |
| `content` | `string` | `true` | `input` | 消息内容 JSON 字符串（data.content）。不同 msg_type 对应不同 content 格式。 | "{\"text\":\"hello\"}" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Send text message to user

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "receive_id_type": "open_id",
    "receive_id": "ou_7d8a6e6df7621556ce0d21922b676706ccs",
    "msg_type": "text",
    "content": "{\"text\":\"Hello, this is a test message!\"}"
  }
}
```

### Example 2: Send text message to chat

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "receive_id_type": "chat_id",
    "receive_id": "oc_xxx",
    "msg_type": "text",
    "content": "{\"text\":\"Hello team!\"}"
  }
}
```

### Example 3: Send rich text (post) message

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "receive_id_type": "open_id",
    "receive_id": "ou_xxx",
    "msg_type": "post",
    "content": "{\"zh_cn\":{\"title\":\"通知\",\"content\":[[{\"tag\":\"text\",\"text\":\"这是一条富文本消息\"}]]}}"
  }
}
```

### Example 4: Send interactive card message

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "receive_id_type": "open_id",
    "receive_id": "ou_xxx",
    "msg_type": "interactive",
    "content": "{\"config\":{\"wide_screen_mode\":true},\"header\":{\"title\":{\"tag\":\"plain_text\",\"content\":\"标题\"}},\"elements\":[{\"tag\":\"div\",\"text\":{\"tag\":\"plain_text\",\"content\":\"内容\"}}]}"
  }
}
```

### Example 5: Send by email

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "receive_id_type": "email",
    "receive_id": "user@example.com",
    "msg_type": "text",
    "content": "{\"text\":\"Message via email\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_im_message_send",
  "tool": "feishu_im_message_send",
  "payload_raw": "{\"params\":{\"receive_id_type\":\"open_id\"},\"data\":{\"receive_id\":\"ou_xxx\",\"msg_type\":\"text\",\"content\":\"{\\\"text\\\":\\\"Hello\\\"}\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"message_id\":\"om_xxx\"}}"
}
```

### Error Response - User Not in Range

```json
{
  "message": "Feishu API invoked successfully: feishu_im_message_send",
  "tool": "feishu_im_message_send",
  "payload_raw": "{\"params\":{\"receive_id_type\":\"open_id\"},\"data\":{\"receive_id\":\"ou_xxx\",\"msg_type\":\"text\",\"content\":\"{\\\"text\\\":\\\"test\\\"}\"}}",
  "response_raw": "{\"code\":99991673,\"msg\":\"user not in app available range\",\"data\":{}}"
}
```

### Error Response - Rate Limit

```json
{
  "message": "Feishu API invoked successfully: feishu_im_message_send",
  "tool": "feishu_im_message_send",
  "payload_raw": "{\"data\":{\"receive_id\":\"ou_xxx\",\"msg_type\":\"text\"}}",
  "response_raw": "{\"code\":1254043,\"msg\":\"Request frequency exceeds limit. Please try again later.\",\"data\":{}}"
}
```