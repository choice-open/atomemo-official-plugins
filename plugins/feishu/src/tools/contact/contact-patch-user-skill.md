# 更新员工信息 Tool Documentation

## Tool

- **Name**: `feishu-contact_patch_user`
- **Module**: `contact`
- **Method**: `PATCH`
- **Path**: `/open-apis/contact/v3/users/{user_id}`
- **Purpose**: Calls Feishu Open API endpoint `PATCH /open-apis/contact/v3/users/{user_id}`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `department_id_type` | `object` | `false` | `feishuDepartmentIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `contact/contact-patch-user.zod.ts`）

```ts
export const contactPatchUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `name` | `string` | `false` | `z.string().optional()` |
| `en_name` | `string` | `false` | `z.string().optional()` |
| `nickname` | `string` | `false` | `z.string().optional()` |
| `email` | `string` | `false` | `z.string().optional()` |
| `mobile` | `string` | `false` | `z.string().optional()` |
| `mobile_visible` | `boolean` | `false` | `z.boolean().optional()` |
| `gender` | `number` | `false` | `z.number().int().optional()` |
| `avatar_key` | `string` | `false` | `z.string().optional()` |
| `department_ids` | `array` | `false` | `z.array(z.string()).optional()` |
| `leader_user_id` | `string` | `false` | `z.string().optional()` |
| `city` | `string` | `false` | `z.string().optional()` |
| `country` | `string` | `false` | `z.string().optional()` |
| `work_station` | `string` | `false` | `z.string().optional()` |
| `join_time` | `number` | `false` | `z.number().int().optional()` |
| `employee_no` | `string` | `false` | `z.string().optional()` |
| `employee_type` | `number` | `false` | `z.number().int().optional()` |
| `positions` | `array` | `false` | `z.array(patchUserPositionSchema).optional()` |
| `orders` | `array` | `false` | `z.array(contactUserOrderSchema).optional()` |
| `custom_attrs` | `array` | `false` | `z.array(patchCustomAttrSchema).optional()` |
| `enterprise_email` | `string` | `false` | `z.string().optional()` |
| `idp_type` | `string` | `false` | `z.string().optional()` |
| `description` | `string` | `false` | `z.string().optional()` |
| `job_title` | `string` | `false` | `z.string().optional()` |
| `is_frozen` | `boolean` | `false` | `z.boolean().optional()` |
| `geo` | `string` | `false` | `z.string().optional()` |
| `job_level_id` | `string` | `false` | `z.string().optional()` |
| `job_family_id` | `string` | `false` | `z.string().optional()` |
| `subscription_ids` | `array` | `false` | `z.array(z.string()).optional()` |
| `department_path` | `array` | `false` | `z.array(patchDepartmentPathItemSchema).optional()` |
| `dotted_line_leader_user_ids` | `array` | `false` | `z.array(z.string()).optional()` |

### Body Schema（完整定义，来自 `contact/contact-patch-user.zod.ts`）

```ts
export const contactPatchUserBodySchema = z
  .object({
    name: z.string().optional(),
    en_name: z.string().optional(),
    nickname: z.string().optional(),
    email: z.string().optional(),
    mobile: z.string().optional(),
    mobile_visible: z.boolean().optional(),
    gender: z.number().int().optional(),
    avatar_key: z.string().optional(),
    department_ids: z.array(z.string()).optional(),
    leader_user_id: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    work_station: z.string().optional(),
    join_time: z.number().int().optional(),
    employee_no: z.string().optional(),
    employee_type: z.number().int().optional(),
    positions: z.array(patchUserPositionSchema).optional(),
    orders: z.array(contactUserOrderSchema).optional(),
    custom_attrs: z.array(patchCustomAttrSchema).optional(),
    enterprise_email: z.string().optional(),
    idp_type: z.string().optional(),
    description: z.string().optional(),
    job_title: z.string().optional(),
    is_frozen: z.boolean().optional(),
    geo: z.string().optional(),
    job_level_id: z.string().optional(),
    job_family_id: z.string().optional(),
    subscription_ids: z.array(z.string()).optional(),
    department_path: z.array(patchDepartmentPathItemSchema).optional(),
    dotted_line_leader_user_ids: z.array(z.string()).optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\",\"email\":\"sample\",\"mobile\":\"sample\",\"mobile_visible\":true,\"gender\":1,\"avatar_key\":\"sample\",\"department_ids\":[],\"leader_user_id\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\"}"
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
