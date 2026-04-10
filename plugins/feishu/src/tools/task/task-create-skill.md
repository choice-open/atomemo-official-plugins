# 创建任务 Tool Documentation

## Tool

- **Name**: `feishu-task_create`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasks`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/task/v2/tasks`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `string` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `task/zod/task-create.zod.ts`）

```ts
export const taskCreateQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `tasklist_guid` | `string` | `false` | 任务清单GUID |
| `tasklist_id` | `string` | `false` | 任务清单ID |
| `summary` | `string` | `false` | 任务标题 |
| `description` | `string` | `false` | 任务描述 |
| `rich_summary` | `string` | `false` | 富文本标题 |
| `rich_description` | `string` | `false` | 富文本描述 |
| `extra` | `string` | `false` | 额外数据 |
| `due` | `object` | `false` | 截止时间 `{timestamp, timezone, is_all_day}` |
| `start` | `object` | `false` | 开始时间 `{timestamp, timezone, is_all_day}` |
| `reminders` | `array` | `false` | 提醒设置 |
| `origin` | `object` | `false` | 来源信息 `{platform_i18n_name, href}` |
| `can_edit` | `boolean` | `false` | 是否可编辑 |
| `custom_fields` | `string` | `false` | 自定义字段JSON |
| `members` | `array` | `false` | 成员ID列表 |
| `tasklists` | `array` | `false` | 任务清单ID列表 |
| `client_token` | `string` | `false` | 客户端令牌 |
| `mode` | `string` | `false` | 模式: task/checklist |
| `is_milestone` | `boolean` | `false` | 是否为里程碑 |

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"summary\":\"新任务\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"summary\":\"新任务\",\"description\":\"任务描述\",\"due\":{\"timestamp\":\"1704067200\",\"timezone\":\"Asia/Shanghai\",\"is_all_day\":false}}"
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
