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
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"receive_id_type\":\"open_id\"}",
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
