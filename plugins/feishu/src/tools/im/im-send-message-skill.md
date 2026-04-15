# 发送消息 Tool Documentation

## Tool

- **Name**: `feishu-im_send_message`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/messages`
- **Purpose**: 本接口用于向指定用户或者群聊发送消息。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/message/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `receive_id_type`：消息接收方 ID 类型（必填），与官方查询参数 `receive_id_type` 一致，支持值：`open_id`、`union_id`、`user_id`、`email`、`chat_id`。
- `body_json`：请求体 JSON 字符串（必填），包含以下字段：
  - `receive_id`（必填）：消息接收方 ID，类型需与 `receive_id_type` 一致
  - `msg_type`（必填）：消息类型，支持 `text`、`post`、`image`、`file`、`audio`、`media`、`sticker`、`interactive`、`share_chat`、`share_user`、`system`
  - `content`（必填）：消息内容，JSON 字符串序列化后的内容，不同 msg_type 对应不同格式
  - `uuid`（可选）：用于消息去重，最大50字符

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "receive_id_type": "open_id",
    "body_json": "{\"receive_id\":\"ou_xxx\",\"msg_type\":\"text\",\"content\":\"{\\\"text\\\":\\\"hello\\\"}\"}"
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
