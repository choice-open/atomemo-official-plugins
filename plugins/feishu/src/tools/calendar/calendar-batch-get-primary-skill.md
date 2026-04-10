# 批量获取主日历信息 Tool Documentation

## Tool

- **Name**: `feishu-calendar_batch_get_primary`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/primarys`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/calendar/v4/calendars/primarys`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

### Body Schema（完整定义，来自 `calendar/zod/calendar-batch-get-primary.zod.ts`）

```ts
export const calendarBatchGetPrimaryBodySchema = z.object({
  // user_ids: Required. User ID list.
  // For example: {"user_ids": ["ou_xxx", "ou_yyy"]}
  user_ids: z.array(z.string()).min(1).max(10),
}).strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"page_size\":20}",
    "body_json": "{\"key\":\"value\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"page_size\":20}",
    "body_json": "{\"key\":\"value\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"page_size\":20}",
    "body_json": "{\"key\":\"value\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"page_size\":20}",
    "body_json": "{\"key\":\"value\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"key\":\"value\"}"
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
