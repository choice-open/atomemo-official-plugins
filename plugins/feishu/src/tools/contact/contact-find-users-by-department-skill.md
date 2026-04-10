# 获取部门直属用户列表 Tool Documentation

## Tool

- **Name**: `feishu-contact_find_users_by_department`
- **Module**: `contact`
- **Method**: `GET`
- **Path**: `/open-apis/contact/v3/users/find_by_department`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/contact/v3/users/find_by_department`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `department_id_type` | `object` | `false` | `feishuDepartmentIdTypeSchema.optional()` |
| `department_id` | `string` | `true` | `z.string()` |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(50).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `contact/contact-find-users-by-department.zod.ts`）

```ts
export const contactFindUsersByDepartmentQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    department_id: z.string(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

### Body Schema（完整定义，来自 `contact/contact-find-users-by-department.zod.ts`）

```ts
export const contactFindUsersByDepartmentBodySchema = z.object({}).strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}"
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
