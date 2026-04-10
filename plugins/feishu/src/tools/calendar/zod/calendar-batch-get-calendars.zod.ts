import { z } from "zod"

/**
 * Schema for query parameters for batch getting calendars
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/calendar/batch_get
 */
export const calendarBatchGetCalendarsQueryParamsSchema = z.object({
  // According to the Feishu API documentation, this endpoint doesn't have any query parameters
})

/**
 * Schema for request body for batch getting calendars
 * POST request with calendar_id_array
 */
export const calendarBatchGetCalendarsBodySchema = z.object({
  // calendar_id_array: Required. Array of calendar IDs to query
  // For example: {"calendar_id_array": ["cal_123", "cal_456"]}
  calendar_id_array: z.array(z.string()),
})

export type CalendarBatchGetCalendarsQueryParams = z.infer<
  typeof calendarBatchGetCalendarsQueryParamsSchema
>
export type CalendarBatchGetCalendarsBody = z.infer<
  typeof calendarBatchGetCalendarsBodySchema
>

export function parseCalendarBatchGetCalendarsQueryParams(
  obj: unknown,
): CalendarBatchGetCalendarsQueryParams {
  return calendarBatchGetCalendarsQueryParamsSchema.parse(obj)
}

export function parseCalendarBatchGetCalendarsBody(
  obj: unknown,
): CalendarBatchGetCalendarsBody {
  return calendarBatchGetCalendarsBodySchema.parse(obj)
}
