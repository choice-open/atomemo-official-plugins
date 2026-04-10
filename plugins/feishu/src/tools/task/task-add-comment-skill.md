# 添加任务评论 Tool Documentation

## Tool

- **Name**: `feishu-task_add_comment`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasks/:task_guid/comments`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/task/v2/tasks/:task_guid/comments`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `task/zod/task-actions.zod.ts`）

```ts
export const taskCommonUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `content` | `string` | `false` | `z.string().optional()` |
| `rich_content` | `string` | `false` | `z.string().optional()` |
| `reply_to_comment_id` | `string` | `false` | `z.string().optional()` |
| `resource_type` | `enum` | `false` | `z.enum(["task"]).optional()` |
| `resource_id` | `string` | `false` | `z.string().optional()` |

### Body Schema（完整定义，来自 `task/zod/task-actions.zod.ts`）

```ts
export const taskAddCommentBodySchema = z
  .object({
    content: z.string().optional(),
    rich_content: z.string().optional(),
    reply_to_comment_id: z.string().optional(),
    resource_type: z.enum(["task"]).optional(),
    resource_id: z.string().optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"content\":\"sample\",\"rich_content\":\"sample\",\"reply_to_comment_id\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"content\":\"sample\",\"rich_content\":\"sample\",\"reply_to_comment_id\":\"sample\",\"resource_type\":\"sample\",\"resource_id\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"content\":\"sample\",\"rich_content\":\"sample\",\"reply_to_comment_id\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"content\":\"sample\",\"rich_content\":\"sample\",\"reply_to_comment_id\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{bad-json",
    "body_json": "{\"content\":\"sample\",\"rich_content\":\"sample\",\"reply_to_comment_id\":\"sample\"}"
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
