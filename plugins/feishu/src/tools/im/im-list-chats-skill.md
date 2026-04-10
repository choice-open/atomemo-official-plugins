# 获取群列表 Tool Documentation

## Tool

- **Name**: `feishu-im_list_chats`
- **Module**: `im`
- **Method**: `GET`
- **Path**: `/open-apis/im/v1/chats`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/im/v1/chats`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `sort_type` | `enum` | `false` | `z.enum(["ByCreateTimeAsc", "ByActiveTimeDesc"]).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |
| `page_size` | `number` | `false` | `z.number().int().max(100).optional()` |

### Query Schema（完整定义，来自 `im/zod/im-list-chats.zod.ts`）

```ts
export const imListChatsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    sort_type: z.enum(["ByCreateTimeAsc", "ByActiveTimeDesc"]).optional(),
    page_token: z.string().optional(),
    page_size: z.number().int().max(100).optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"sort_type\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json"
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
