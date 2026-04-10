# 邀请日程参与者 Tool Documentation

## Tool

- **Name**: `feishu-calendar_add_event_attendees`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `calendar/zod/calendar-add-event-attendees.zod.ts`）

```ts
export const calendarAddEventAttendeesQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `attendees` | `array` | `false` | `z.array(attendeeSchema).optional()` |
| `need_notification` | `boolean` | `false` | `z.boolean().optional()` |
| `add_operator_to_attendee` | `boolean` | `false` | `z.boolean().optional()` |

### Body Schema（完整定义，来自 `calendar/zod/calendar-add-event-attendees.zod.ts`）

```ts
export const calendarAddEventAttendeesBodySchema = z
  .object({
    attendees: z.array(attendeeSchema).optional(),
    need_notification: z.boolean().optional(),
    add_operator_to_attendee: z.boolean().optional(),
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
    "event_id": "<event_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"attendees\":[],\"need_notification\":true,\"add_operator_to_attendee\":true}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "event_id": "<event_id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"attendees\":[],\"need_notification\":true,\"add_operator_to_attendee\":true}"
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
