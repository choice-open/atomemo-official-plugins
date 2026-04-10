# 完成任务 Tool Documentation

## Tool

- **Name**: `feishu-task_complete`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasks/:task_guid/complete`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/task/v2/tasks/:task_guid/complete`.

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
| (无) | - | - | POST请求，但官方API无需请求体 |

## Tool Input 示例

### 示例1（成功）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
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
