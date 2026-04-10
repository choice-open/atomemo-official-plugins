# 审批任务同意 Tool Documentation

## Tool

- **Name**: `feishu-approval_task_approve`
- **Module**: `approval`
- **Method**: `POST`
- **Path**: `/open-apis/approval/v4/tasks/approve`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/approval/v4/tasks/approve`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `string` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `approval/zod/approval-shared.zod.ts`）

```ts
export const approvalCommonQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `task_id` | `string` | `true` | 审批任务ID |
| `comment` | `string` | `false` | 审批意见 |

## Tool Input 示例

### 示例1（成功）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"task_id\":\"7000000000000000000\"}"
  }
}
```

### 示例2（成功，带审批意见）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"task_id\":\"7000000000000000000\",\"comment\":\"同意\"}"
  }
}
```

### 示例3（错误，缺少必填参数）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

### 示例4（错误，参数类型/格式非法）

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
