# 发送消息 Tool Documentation

## Tool

- **Name**: `feishu-im_send_message`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/messages`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/im/v1/messages`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `receive_id_type` | `string` | `true` | `feishuReceiveIdTypeSchema` (枚举: open_id/user_id/union_id/email/chat_id) |

### Query Schema（完整定义，来自 `im/zod/im-send-message.zod.ts`）

```ts
export const imSendMessageQuerySchema = z
  .object({
    receive_id_type: feishuReceiveIdTypeSchema,
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `receive_id` | `string` | `true` | `z.string()` |
| `msg_type` | `string` | `true` | `feishuMsgTypeSchema` (枚举: text/post/image/file/audio/video/interactive/card) |
| `content` | `string` | `true` | `z.string()` |
| `uuid` | `string` | `false` | `z.string().optional()` |

### Body Schema（完整定义，来自 `im/zod/im-send-message.zod.ts`）

```ts
export const imSendMessageBodySchema = z
  .object({
    receive_id: z.string(),
    msg_type: feishuMsgTypeSchema,
    content: z.string(),
    uuid: z.string().optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"receive_id_type\":\"open_id\"}",
    "body_json": "{\"receive_id\":\"ou_xxxxx\",\"msg_type\":\"text\",\"content\":\"Hello\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"receive_id_type\":\"open_id\"}",
    "body_json": "{\"receive_id\":\"ou_xxxxx\",\"msg_type\":\"text\",\"content\":\"Hello\",\"uuid\":\"unique-uuid-123\"}"
  }
}
```

### 示例3（成功，使用user_id）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"receive_id_type\":\"user_id\"}",
    "body_json": "{\"receive_id\":\"user_xxxxx\",\"msg_type\":\"text\",\"content\":\"Hello\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"receive_id_type\":\"open_id\"}",
    "body_json": "{\"receive_id\":\"ou_xxxxx\",\"msg_type\":\"text\",\"content\":\"Hello\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"receive_id\":\"ou_xxxxx\",\"msg_type\":\"text\",\"content\":\"Hello\"}"
  }
}
```

## Tool Output 示例

### 成功

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

### 失败（参数错误示意）

```json
{
  "code": 400,
  "msg": "invalid parameter",
  "data": {}
}
```
