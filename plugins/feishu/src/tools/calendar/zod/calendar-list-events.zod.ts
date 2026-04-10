/**
 * 飞书「获取日程列表」GET /open-apis/calendar/v4/calendars/:calendar_id/events
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/list
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "./calendar-shared.zod"

export const calendarListEventsQuerySchema = z
  .object({
    page_size: z.number().int().optional(),
    anchor_time: z.string().optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const calendarListEventsBodySchema = emptyBodyStrictSchema

export type CalendarListEventsQuery = z.infer<typeof calendarListEventsQuerySchema>

export function parseCalendarListEventsQuery(
  raw: Record<string, unknown>,
): CalendarListEventsQuery {
  return calendarListEventsQuerySchema.parse(raw)
}

export function parseCalendarListEventsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return calendarListEventsBodySchema.parse(raw) as Record<string, never>
}
