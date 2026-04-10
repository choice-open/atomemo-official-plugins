/**
 * 飞书「创建日程」POST /open-apis/calendar/v4/calendars/:calendar_id/events
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./calendar-shared.zod"

const eventTimestampSchema = z
  .object({
    date: z.string().optional(),
    timestamp: z.string().optional(),
    timezone: z.string().optional(),
  })
  .strict()

const meetingSettingsSchema = z
  .object({
    owner_id: z.string().optional(),
    join_meeting_permission: z
      .enum([
        "anyone_can_join",
        "only_organization_employees",
        "only_event_attendees",
      ])
      .optional(),
    assign_hosts: z.array(z.string()).optional(),
    auto_record: z.boolean().optional(),
    open_lobby: z.boolean().optional(),
    allow_attendees_start: z.boolean().optional(),
  })
  .strict()

const vchatSchema = z
  .object({
    vc_type: z
      .enum(["vc", "third_party", "no_meeting", "lark_live", "unknown"])
      .optional(),
    icon_type: z.enum(["vc", "live", "default"]).optional(),
    description: z.string().optional(),
    meeting_url: z.string().optional(),
    meeting_settings: meetingSettingsSchema.optional(),
  })
  .strict()

const eventLocationSchema = z
  .object({
    name: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .strict()

const reminderSchema = z
  .object({
    minutes: z.number().int(),
  })
  .strict()

const schemaUiSchema = z
  .object({
    ui_name: z.string().optional(),
    ui_status: z.enum(["hide", "readonly", "editable", "unknown"]).optional(),
    app_link: z.string().optional(),
  })
  .strict()

const attachmentSchema = z
  .object({
    file_token: z.string(),
  })
  .strict()

const checkInTimeSchema = z
  .object({
    time_type: z.enum([
      "before_event_start",
      "after_event_start",
      "after_event_end",
    ]),
    duration: z.number().int(),
  })
  .strict()

const eventCheckInSchema = z
  .object({
    enable_check_in: z.boolean(),
    check_in_start_time: checkInTimeSchema.optional(),
    check_in_end_time: checkInTimeSchema.optional(),
    need_notify_attendees: z.boolean().optional(),
  })
  .strict()

/** 查询参数 */
export const calendarCreateEventQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    idempotency_key: z.string().optional(),
  })
  .strict()

/** 请求体 */
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

export type CalendarCreateEventQuery = z.infer<
  typeof calendarCreateEventQuerySchema
>
export type CalendarCreateEventBody = z.infer<
  typeof calendarCreateEventBodySchema
>

export function parseCalendarCreateEventQuery(
  raw: Record<string, unknown>,
): CalendarCreateEventQuery {
  return calendarCreateEventQuerySchema.parse(raw)
}

export function parseCalendarCreateEventBody(
  raw: Record<string, unknown>,
): CalendarCreateEventBody {
  return calendarCreateEventBodySchema.parse(raw)
}
