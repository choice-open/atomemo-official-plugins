# 拉用户入群 Tool Documentation

## Tool

- **Name**: `feishu-im_add_chat_members`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/chats/:chat_id/members`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/im/v1/chats/:chat_id/members`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `member_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `im/zod/im-add-chat-members.zod.ts`）

```ts
export const imAddChatMembersQuerySchema = z
  .object({
    member_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `id_list` | `array` | `true` | `z.array(z.string())` |

### Body Schema（完整定义，来自 `im/zod/im-add-chat-members.zod.ts`）

```ts
export const imAddChatMembersBodySchema = z
  .object({
    id_list: z.array(z.string()),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{\"member_id_type\":\"sample\"}",
    "body_json": "{\"id_list\":[]}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"id_list\":[]}"
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
