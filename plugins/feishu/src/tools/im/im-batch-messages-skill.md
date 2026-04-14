# 批量发送消息 Tool Documentation

## Tool

- **Name**: `feishu-im_batch_messages`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/message/v4/batch_send/`
- **Purpose**: 本接口用于给多个用户或者多个部门中的成员发送消息。
- **API Doc**: https://open.feishu.cn/document/server-docs/im-v1/batch_message/send-messages-in-batches

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"open_ids\":[\"ou_xxx\"],\"msg_type\":\"text\",\"content\":{\"text\":\"hello\"}}"
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
