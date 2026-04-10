# 移出群成员 Tool Documentation

## Tool

- **Name**: `feishu-im_remove_chat_member`
- **Module**: `im`
- **Method**: `DELETE`
- **Path**: `/open-apis/im/v1/chats/:chat_id/members/:member_id`
- **Purpose**: Calls Feishu Open API endpoint `DELETE /open-apis/im/v1/chats/:chat_id/members/:member_id`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `member_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `im/zod/im-remove-chat-member.zod.ts`）

```ts
export const imRemoveChatMemberQuerySchema = z
  .object({
    member_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `id_list` | `array` | `true` | `z.array(z.string())` |

### Body Schema（完整定义，来自 `im/zod/im-remove-chat-member.zod.ts`）

```ts
export const imRemoveChatMemberBodySchema = z
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
    "member_id": "<member_id>",
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
    "member_id": "<member_id>",
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
