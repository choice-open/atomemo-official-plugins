# 更新任务 Tool Documentation

## Tool

- **Name**: `feishu-task_patch`
- **Module**: `task`
- **Method**: `PATCH`
- **Path**: `/open-apis/task/v2/tasks/:task_guid`
- **Purpose**: Calls Feishu Open API endpoint `PATCH /open-apis/task/v2/tasks/:task_guid`.

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
| `summary` | `string` | `false` | 任务标题 |
| `description` | `string` | `false` | 任务描述 |
| `due` | `object` | `false` | 截止时间 `{timestamp, timezone, is_all_day}` |
| `start` | `object` | `false` | 开始时间 `{timestamp, timezone, is_all_day}` |
| `completed_at` | `string` | `false` | 完成时间戳 |
| `repeat_rule` | `string` | `false` | 重复规则 |
| `custom_complete` | `boolean` | `false` | 自定义完成 |
| `mode` | `string` | `false` | 模式: task/checklist |
| `is_milestone` | `boolean` | `false` | 是否为里程碑 |
| `custom_fields` | `string` | `false` | 自定义字段JSON |
| `update_fields` | `string` | `false` | 指定更新字段列表 |

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"summary\":\"新任务标题\"}"
  }
}
```

### 示例2（成功，更新截止时间）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"due\":{\"timestamp\":\"1704067200\",\"timezone\":\"Asia/Shanghai\",\"is_all_day\":false}}"
  }
}
```

### 示例3（错误，缺少必填参数）

```json
{
  "parameters": {
    "task_guid": "<task_guid>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

### 示例4（错误，参数类型/格式非法）

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
