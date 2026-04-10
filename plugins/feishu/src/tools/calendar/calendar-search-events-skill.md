# 搜索日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_search_events`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/{calendar_id}/events/search`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/calendar/v4/calendars/{calendar_id}/events/search`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |
| `page_size` | `number` | `false` | `z.number().int().min(10).max(100).optional()` |

### Query Schema（完整定义，来自 `calendar/zod/calendar-search-events.zod.ts`）

```ts
export const calendarSearchEventsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_token: z.string().optional(),
    page_size: z.number().int().min(10).max(100).optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `query` | `string` | `true` | `z.string().min(0).max(200)` |
| `filter` | `object` | `false` | `filterSchema.optional()` |

### Body Schema（完整定义，来自 `calendar/zod/calendar-search-events.zod.ts`）

```ts
export const calendarSearchEventsBodySchema = z
  .object({
    query: z.string().min(0).max(200),
    filter: filterSchema.optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"page_token\":\"sample\"}",
    "body_json": "{\"query\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"page_token\":\"sample\",\"page_size\":20}",
    "body_json": "{\"query\":\"sample\",\"filter\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"page_token\":\"sample\"}",
    "body_json": "{\"query\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"page_token\":\"sample\"}",
    "body_json": "{\"query\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"query\":\"sample\"}"
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
