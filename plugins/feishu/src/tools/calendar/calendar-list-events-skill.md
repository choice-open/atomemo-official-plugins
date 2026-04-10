# 获取日程列表 Tool Documentation

## Tool

- **Name**: `feishu-calendar_list_events`
- **Module**: `calendar`
- **Method**: `GET`
- **Path**: `/open-apis/calendar/v4/calendars/{calendar_id}/events`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/calendar/v4/calendars/{calendar_id}/events`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `page_size` | `number` | `false` | `z.number().int().optional()` |
| `anchor_time` | `string` | `false` | `z.string().optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `calendar/zod/calendar-list-events.zod.ts`）

```ts
export const calendarListEventsQuerySchema = z
  .object({
    page_size: z.number().int().optional(),
    anchor_time: z.string().optional(),
    page_token: z.string().optional(),
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
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"page_size\":20,\"anchor_time\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
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
