# 获取任务详情 Tool Documentation

## Tool

- **Name**: `feishu-task_get`
- **Module**: `task`
- **Method**: `GET`
- **Path**: `/open-apis/task/v2/tasks/:task_guid`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/task/v2/tasks/:task_guid`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `enum` | `false` | `z.enum(["open_id", "union_id", "user_id"]).optional()` |

### Query Schema（完整定义，来自 `task/task-get.zod.ts`）

```ts
export const taskGetQuerySchema = z
  .object({
    user_id_type: z.enum(["open_id", "union_id", "user_id"]).optional(),
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
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

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
