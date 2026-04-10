import { z } from "zod"
import { emptyBodyStrictSchema } from "@/shared/zod"

/**
 * Schema for query parameters for getting a calendar
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/calendar/get
 */
export const calendarGetCalendarQueryParamsSchema = z.object({
  // According to the Feishu API documentation, this endpoint doesn't have any query parameters
  // However, we keep the schema open for future extensions or undocumented parameters
})

/**
 * Schema for request body for getting a calendar
 * GET requests should not have a body
 */
export const calendarGetCalendarBodySchema = emptyBodyStrictSchema

export type CalendarGetCalendarQueryParams = z.infer<
  typeof calendarGetCalendarQueryParamsSchema
>
export type CalendarGetCalendarBody = z.infer<
  typeof calendarGetCalendarBodySchema
>

export function parseCalendarGetCalendarQueryParams(
  obj: unknown,
): CalendarGetCalendarQueryParams {
  return calendarGetCalendarQueryParamsSchema.parse(obj)
}

export function parseCalendarGetCalendarBody(
  obj: unknown,
): CalendarGetCalendarBody {
  return calendarGetCalendarBodySchema.parse(obj)
}
