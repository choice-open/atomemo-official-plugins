/**
 * 飞书「搜索日程」POST /open-apis/calendar/v4/calendars/:calendar_id/events/search
 * @see https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/search
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./calendar-shared.zod"

const timeInfoSchema = z
  .object({
    date: z.string().optional(),
    timestamp: z.string().optional(),
    timezone: z.string().optional(),
  })
  .strict()

const filterSchema = z
  .object({
    start_time: timeInfoSchema.optional(),
    end_time: timeInfoSchema.optional(),
    user_ids: z.array(z.string()).optional(),
    room_ids: z.array(z.string()).optional(),
    chat_ids: z.array(z.string()).optional(),
  })
  .strict()

export const calendarSearchEventsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_token: z.string().optional(),
    page_size: z.number().int().min(10).max(100).optional(),
  })
  .strict()

export const calendarSearchEventsBodySchema = z
  .object({
    query: z.string().min(0).max(200),
    filter: filterSchema.optional(),
  })
  .strict()

export type CalendarSearchEventsQuery = z.infer<typeof calendarSearchEventsQuerySchema>
export type CalendarSearchEventsBody = z.infer<typeof calendarSearchEventsBodySchema>

export function parseCalendarSearchEventsQuery(
  raw: Record<string, unknown>,
): CalendarSearchEventsQuery {
  return calendarSearchEventsQuerySchema.parse(raw)
}

export function parseCalendarSearchEventsBody(
  raw: Record<string, unknown>,
): CalendarSearchEventsBody {
  return calendarSearchEventsBodySchema.parse(raw)
}
