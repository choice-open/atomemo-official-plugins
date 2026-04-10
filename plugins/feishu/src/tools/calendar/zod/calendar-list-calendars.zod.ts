/**
 * 飞书「查询日历列表」GET /open-apis/calendar/v4/calendars
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./calendar-shared.zod"

export const calendarListCalendarsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const calendarListCalendarsBodySchema = emptyBodyStrictSchema

export type CalendarListCalendarsQuery = z.infer<typeof calendarListCalendarsQuerySchema>

export function parseCalendarListCalendarsQuery(
  raw: Record<string, unknown>,
): CalendarListCalendarsQuery {
  return calendarListCalendarsQuerySchema.parse(raw)
}

export function parseCalendarListCalendarsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return calendarListCalendarsBodySchema.parse(raw) as Record<string, never>
}
