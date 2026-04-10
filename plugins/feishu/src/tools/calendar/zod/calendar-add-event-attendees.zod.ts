/**
 * 飞书「添加日程参与人」POST /open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./calendar-shared.zod"

const attendeeSchema = z
  .object({
    type: z.enum(["user", "chat", "resource", "third_party"]).optional(),
    is_optional: z.boolean().optional(),
    user_id: z.string().optional(),
    chat_id: z.string().optional(),
    room_id: z.string().optional(),
    third_party_email: z.string().optional(),
    operate_id: z.string().optional(),
  })
  .strict()

/** 查询参数 */
export const calendarAddEventAttendeesQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const calendarAddEventAttendeesBodySchema = z
  .object({
    attendees: z.array(attendeeSchema).optional(),
    need_notification: z.boolean().optional(),
    add_operator_to_attendee: z.boolean().optional(),
  })
  .strict()

export type CalendarAddEventAttendeesQuery = z.infer<
  typeof calendarAddEventAttendeesQuerySchema
>
export type CalendarAddEventAttendeesBody = z.infer<
  typeof calendarAddEventAttendeesBodySchema
>

export function parseCalendarAddEventAttendeesQuery(
  raw: Record<string, unknown>,
): CalendarAddEventAttendeesQuery {
  return calendarAddEventAttendeesQuerySchema.parse(raw)
}

export function parseCalendarAddEventAttendeesBody(
  raw: Record<string, unknown>,
): CalendarAddEventAttendeesBody {
  return calendarAddEventAttendeesBodySchema.parse(raw)
}
