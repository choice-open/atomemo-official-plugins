# 创建子任务 Tool Documentation

## Tool

- **Name**: `feishu-task_create_subtask`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasks/:task_guid/subtasks`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/task/v2/tasks/:task_guid/subtasks`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `string` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `task/zod/task-shared.zod.ts`）

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
| `summary` | `string` | `true` | 子任务标题 |
| `description` | `string` | `false` | 子任务描述 |
| `due` | `object` | `false` | 截止时间 `{timestamp, timezone, is_all_day}` |

## Tool Input 示例

### 示例1（成功）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"summary\":\"子任务标题\"}"
  }
}
```

### 示例2（错误，缺少必填参数）

```json
{
  "parameters": {
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

### 示例3（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
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
