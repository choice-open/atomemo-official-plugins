# 搜索员工信息 Tool Documentation

## Tool

- **Name**: `feishu-contact_search_users`
- **Module**: `contact`
- **Method**: `GET`
- **Path**: `/open-apis/search/v1/user`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/search/v1/user`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `query` | `string` | `true` | `z.string().min(1)` |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(200).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `contact/contact-search-users.zod.ts`）

```ts
export const contactSearchUsersQuerySchema = z
  .object({
    query: z.string().min(1),
    page_size: z.number().int().min(1).max(200).optional(),
    page_token: z.string().optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

### Body Schema（完整定义，来自 `contact/contact-search-users.zod.ts`）

```ts
export const contactSearchUsersBodySchema = z.object({}).strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"query\":\"sample\",\"page_size\":20}"
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
