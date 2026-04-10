# 获取子部门列表 Tool Documentation

## Tool

- **Name**: `feishu-contact_get_department_children`
- **Module**: `contact`
- **Method**: `GET`
- **Path**: `/open-apis/contact/v3/departments/:department_id/children`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/contact/v3/departments/:department_id/children`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `department_id_type` | `object` | `false` | `feishuDepartmentIdTypeSchema.optional()` |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(50).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |
| `fetch_child` | `boolean` | `false` | `z.boolean().optional()` |

### Query Schema（完整定义，来自 `contact/contact-get-department-children.zod.ts`）

```ts
export const contactGetDepartmentChildrenQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    fetch_child: z.boolean().optional(),
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
    "department_id": "<department_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "department_id": "<department_id>",
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
