# 离职员工 Tool Documentation

## Tool

- **Name**: `feishu-contact_delete_user`
- **Module**: `contact`
- **Method**: `DELETE`
- **Path**: `/open-apis/contact/v3/users/{user_id}`
- **Purpose**: Calls Feishu Open API endpoint `DELETE /open-apis/contact/v3/users/{user_id}`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `contact/contact-delete-user.zod.ts`）

```ts
export const contactDeleteUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `department_chat_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `external_chat_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `docs_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `calendar_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `application_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `minutes_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `survey_acceptor_user_id` | `string` | `false` | `z.string().optional()` |
| `email_acceptor` | `object` | `false` | `emailAcceptorSchema.optional()` |
| `anycross_acceptor_user_id` | `string` | `false` | `z.string().optional()` |

### Body Schema（完整定义，来自 `contact/contact-delete-user.zod.ts`）

```ts
export const contactDeleteUserBodySchema = z
  .object({
    department_chat_acceptor_user_id: z.string().optional(),
    external_chat_acceptor_user_id: z.string().optional(),
    docs_acceptor_user_id: z.string().optional(),
    calendar_acceptor_user_id: z.string().optional(),
    application_acceptor_user_id: z.string().optional(),
    minutes_acceptor_user_id: z.string().optional(),
    survey_acceptor_user_id: z.string().optional(),
    email_acceptor: emailAcceptorSchema.optional(),
    anycross_acceptor_user_id: z.string().optional(),
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
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"department_chat_acceptor_user_id\":\"sample\",\"external_chat_acceptor_user_id\":\"sample\",\"docs_acceptor_user_id\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"department_chat_acceptor_user_id\":\"sample\",\"external_chat_acceptor_user_id\":\"sample\",\"docs_acceptor_user_id\":\"sample\",\"calendar_acceptor_user_id\":\"sample\",\"application_acceptor_user_id\":\"sample\",\"minutes_acceptor_user_id\":\"sample\",\"survey_acceptor_user_id\":\"sample\",\"email_acceptor\":\"sample\",\"anycross_acceptor_user_id\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"department_chat_acceptor_user_id\":\"sample\",\"external_chat_acceptor_user_id\":\"sample\",\"docs_acceptor_user_id\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "user_id": "<user_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"department_chat_acceptor_user_id\":\"sample\",\"external_chat_acceptor_user_id\":\"sample\",\"docs_acceptor_user_id\":\"sample\"}"
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
    "body_json": "{\"department_chat_acceptor_user_id\":\"sample\",\"external_chat_acceptor_user_id\":\"sample\",\"docs_acceptor_user_id\":\"sample\"}"
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
