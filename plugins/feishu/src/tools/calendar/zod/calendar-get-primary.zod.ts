import { z } from "zod"
import { emptyBodyStrictSchema } from "@/shared/zod"

/**
 * Schema for query parameters for getting primary calendar
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/calendar-primary/get
 */
export const calendarGetPrimaryQueryParamsSchema = z.object({
  // According to the Feishu API documentation, this endpoint doesn't have any query parameters
  // However, we keep the schema open for future extensions or undocumented parameters
  // but we'll validate that if any are passed, they're at least in the correct format
})

/**
 * Schema for request body for getting primary calendar
 * GET requests should not have a body
 */
export const calendarGetPrimaryBodySchema = emptyBodyStrictSchema

export type CalendarGetPrimaryQueryParams = z.infer<
  typeof calendarGetPrimaryQueryParamsSchema
>
export type CalendarGetPrimaryBody = z.infer<
  typeof calendarGetPrimaryBodySchema
>

export function parseCalendarGetPrimaryQueryParams(
  obj: unknown,
): CalendarGetPrimaryQueryParams {
  return calendarGetPrimaryQueryParamsSchema.parse(obj)
}

export function parseCalendarGetPrimaryBody(
  obj: unknown,
): CalendarGetPrimaryBody {
  return calendarGetPrimaryBodySchema.parse(obj)
}
