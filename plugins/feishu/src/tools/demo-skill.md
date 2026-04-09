# Send Feishu Webhook Message Tool Documentation

## Tool

- **Name**: `send_feishu_webhook_message`
- **Skill**: `send.feishu.webhook.message`
- **Purpose**: 通过飞书群机器人 Webhook 发送文本消息（非 Open API SDK，直接 HTTP POST）。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证（本工具校验存在性；实际发送走 webhook）。 | — |
| `webhook_url` | `string` | `true` | `input` | 群机器人 Webhook 地址。支持表达式。 | `https://open.feishu.cn/open-apis/bot/v2/hook/...` |
| `text` | `string` | `true` | `input` | 要发送的纯文本内容。支持表达式。 | `Hello` |

## Tool Input Example

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "webhook_url": "https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx",
    "text": "Hello from Atomemo"
  }
}
```

## Tool Output Example

```json
{
  "message": "Feishu webhook message sent successfully",
  "webhook_url": "https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx",
  "request_payload": {
    "msg_type": "text",
    "content": { "text": "Hello from Atomemo" }
  },
  "response_raw": "{}"
}
```
