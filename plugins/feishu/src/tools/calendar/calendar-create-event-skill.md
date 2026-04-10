# 创建日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_create_event`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/{calendar_id}/events`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/calendar/v4/calendars/{calendar_id}/events`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `idempotency_key` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `calendar/zod/calendar-create-event.zod.ts`）

```ts
export const calendarCreateEventQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    idempotency_key: z.string().optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `summary` | `string` | `false` | `z.string().optional()` |
| `description` | `string` | `false` | `z.string().optional()` |
| `need_notification` | `boolean` | `false` | `z.boolean().optional()` |
| `start_time` | `object` | `true` | `eventTimestampSchema` |
| `end_time` | `object` | `true` | `eventTimestampSchema` |
| `vchat` | `object` | `false` | `vchatSchema.optional()` |
| `recurrence` | `string` | `false` | `z.string().optional()` |
| `visibility` | `enum` | `false` | `z.enum(["default", "public", "private"]).optional()` |
| `attendee_ability` | `unknown` | `false` | `z .enum(["none", "can_see_others", "can_invite_others", "can_modify_event"]) .optional()` |
| `free_busy_status` | `enum` | `false` | `z.enum(["busy", "free"]).optional()` |
| `location` | `object` | `false` | `eventLocationSchema.optional()` |
| `color` | `number` | `false` | `z.number().int().optional()` |
| `reminders` | `array` | `false` | `z.array(reminderSchema).optional()` |
| `schemas` | `array` | `false` | `z.array(schemaUiSchema).optional()` |
| `attachments` | `array` | `false` | `z.array(attachmentSchema).optional()` |
| `event_check_in` | `object` | `false` | `eventCheckInSchema.optional()` |

### Body Schema（完整定义，来自 `calendar/zod/calendar-create-event.zod.ts`）

```ts
export const calendarCreateEventBodySchema = z
  .object({
    summary: z.string().optional(),
    description: z.string().optional(),
    need_notification: z.boolean().optional(),
    start_time: eventTimestampSchema,
    end_time: eventTimestampSchema,
    vchat: vchatSchema.optional(),
    recurrence: z.string().optional(),
    visibility: z.enum(["default", "public", "private"]).optional(),
    attendee_ability: z
      .enum(["none", "can_see_others", "can_invite_others", "can_modify_event"])
      .optional(),
    free_busy_status: z.enum(["busy", "free"]).optional(),
    location: eventLocationSchema.optional(),
    color: z.number().int().optional(),
    reminders: z.array(reminderSchema).optional(),
    schemas: z.array(schemaUiSchema).optional(),
    attachments: z.array(attachmentSchema).optional(),
    event_check_in: eventCheckInSchema.optional(),
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
    "query_params_json": "{\"user_id_type\":\"sample\",\"idempotency_key\":\"sample\"}",
    "body_json": "{\"start_time\":\"sample\",\"end_time\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"idempotency_key\":\"sample\"}",
    "body_json": "{\"summary\":\"sample\",\"description\":\"sample\",\"need_notification\":true,\"start_time\":\"sample\",\"end_time\":\"sample\",\"vchat\":\"sample\",\"recurrence\":\"sample\",\"visibility\":\"sample\",\"attendee_ability\":\"sample\",\"free_busy_status\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"idempotency_key\":\"sample\"}",
    "body_json": "{\"start_time\":\"sample\",\"end_time\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "calendar_id": "<calendar_id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"idempotency_key\":\"sample\"}",
    "body_json": "{\"start_time\":\"sample\",\"end_time\":\"sample\"}"
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
    "body_json": "{\"start_time\":\"sample\",\"end_time\":\"sample\"}"
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
