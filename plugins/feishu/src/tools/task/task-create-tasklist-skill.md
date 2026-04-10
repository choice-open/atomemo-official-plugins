# 创建清单 Tool Documentation

## Tool

- **Name**: `feishu-task_create_tasklist`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasklists`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/task/v2/tasklists`.

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
| `name` | `string` | `true` | 清单名称 |
| `description` | `string` | `false` | 清单描述 |

## Tool Input 示例

### 示例1（成功）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"name\":\"新清单\"}"
  }
}
```

### 示例2（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

### 示例3（错误，参数类型/格式非法）

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
