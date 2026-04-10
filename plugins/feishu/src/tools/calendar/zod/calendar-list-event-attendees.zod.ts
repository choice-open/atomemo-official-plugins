/**
 * 飞书「获取日程参与人列表」GET /open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees
 * @see https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./calendar-shared.zod"

export const calendarListEventAttendeesQuerySchema = z
  .object({
    page_token: z.string().optional(),
    page_size: z.number().int().max(100).optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const calendarListEventAttendeesBodySchema = emptyBodyStrictSchema

export type CalendarListEventAttendeesQuery = z.infer<
  typeof calendarListEventAttendeesQuerySchema
>

export function parseCalendarListEventAttendeesQuery(
  raw: Record<string, unknown>,
): CalendarListEventAttendeesQuery {
  return calendarListEventAttendeesQuerySchema.parse(raw)
}

export function parseCalendarListEventAttendeesBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return calendarListEventAttendeesBodySchema.parse(raw) as Record<string, never>
}
