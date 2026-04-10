# 创建员工 Tool Documentation

## Tool

- **Name**: `feishu-contact_create_user`
- **Module**: `contact`
- **Method**: `POST`
- **Path**: `/open-apis/contact/v3/users`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/contact/v3/users`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `unknown` | `false` | `userIdType.optional()` |
| `department_id_type` | `unknown` | `false` | `departmentIdType.optional()` |
| `client_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `contact/contact-create-user.zod.ts`）

```ts
export const contactCreateUserQuerySchema = z
  .object({
    user_id_type: userIdType.optional(),
    department_id_type: departmentIdType.optional(),
    client_token: z.string().optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id` | `string` | `false` | `z.string().max(64).optional()` |
| `name` | `string` | `true` | `z.string().min(1).max(255)` |
| `en_name` | `string` | `false` | `z.string().max(255).optional()` |
| `nickname` | `string` | `false` | `z.string().max(255).optional()` |
| `email` | `string` | `false` | `z.string().optional()` |
| `mobile` | `string` | `true` | `z.string()` |
| `mobile_visible` | `boolean` | `false` | `z.boolean().optional()` |
| `gender` | `unknown` | `false` | `z .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]) .optional()` |
| `avatar_key` | `string` | `false` | `z.string().optional()` |
| `department_ids` | `array` | `true` | `z.array(z.string()).min(1)` |
| `leader_user_id` | `string` | `false` | `z.string().optional()` |
| `city` | `string` | `false` | `z.string().max(100).optional()` |
| `country` | `string` | `false` | `z.string().optional()` |
| `work_station` | `string` | `false` | `z.string().max(255).optional()` |
| `join_time` | `number` | `false` | `z.number().int().optional()` |
| `employee_no` | `string` | `false` | `z.string().max(255).optional()` |
| `employee_type` | `number` | `true` | `z.number().int()` |
| `orders` | `array` | `false` | `z.array(userOrderSchema).optional()` |
| `custom_attrs` | `array` | `false` | `z.array(userCustomAttrSchema).optional()` |
| `enterprise_email` | `string` | `false` | `z.string().optional()` |
| `job_title` | `string` | `false` | `z.string().max(255).optional()` |
| `geo` | `string` | `false` | `z.string().optional()` |
| `job_level_id` | `string` | `false` | `z.string().optional()` |
| `job_family_id` | `string` | `false` | `z.string().optional()` |
| `subscription_ids` | `array` | `false` | `z.array(z.string()).optional()` |
| `dotted_line_leader_user_ids` | `array` | `false` | `z.array(z.string()).optional()` |
| `notification_option` | `object` | `false` | `notificationOptionSchema.optional()` |

### Body Schema（完整定义，来自 `contact/contact-create-user.zod.ts`）

```ts
export const contactCreateUserBodySchema = z
  .object({
    user_id: z.string().max(64).optional(),
    name: z.string().min(1).max(255),
    en_name: z.string().max(255).optional(),
    nickname: z.string().max(255).optional(),
    email: z.string().optional(),
    mobile: z.string(),
    mobile_visible: z.boolean().optional(),
    gender: z
      .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
      .optional(),
    avatar_key: z.string().optional(),
    department_ids: z.array(z.string()).min(1),
    leader_user_id: z.string().optional(),
    city: z.string().max(100).optional(),
    country: z.string().optional(),
    work_station: z.string().max(255).optional(),
    join_time: z.number().int().optional(),
    employee_no: z.string().max(255).optional(),
    employee_type: z.number().int(),
    orders: z.array(userOrderSchema).optional(),
    custom_attrs: z.array(userCustomAttrSchema).optional(),
    enterprise_email: z.string().optional(),
    job_title: z.string().max(255).optional(),
    geo: z.string().optional(),
    job_level_id: z.string().optional(),
    job_family_id: z.string().optional(),
    subscription_ids: z.array(z.string()).optional(),
    dotted_line_leader_user_ids: z.array(z.string()).optional(),
    notification_option: notificationOptionSchema.optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"mobile\":\"sample\",\"department_ids\":[],\"employee_type\":1}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\",\"client_token\":\"sample\"}",
    "body_json": "{\"user_id\":\"sample\",\"name\":\"sample\",\"en_name\":\"sample\",\"nickname\":\"sample\",\"email\":\"sample\",\"mobile\":\"sample\",\"mobile_visible\":true,\"gender\":\"sample\",\"avatar_key\":\"sample\",\"department_ids\":[]}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"mobile\":\"sample\",\"department_ids\":[],\"employee_type\":1}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"user_id_type\":\"sample\",\"department_id_type\":\"sample\"}",
    "body_json": "{\"name\":\"sample\",\"mobile\":\"sample\",\"department_ids\":[],\"employee_type\":1}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"name\":\"sample\",\"mobile\":\"sample\",\"department_ids\":[],\"employee_type\":1}"
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
