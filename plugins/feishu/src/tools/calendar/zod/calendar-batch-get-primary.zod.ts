import { z } from "zod"

/**
 * Schema for query parameters for batch getting primary calendars
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/calendar-primary/batch_get
 */
export const calendarBatchGetPrimaryQueryParamsSchema = z.object({
  // According to the Feishu API documentation, this endpoint doesn't have any query parameters
})

/**
 * Schema for request body for batch getting primary calendars
 * POST request with user_id_type array
 */
export const calendarBatchGetPrimaryBodySchema = z.object({
  // user_id_type: The type of user ID. Required. Array of strings.
  // Valid values: user_id, open_id, union_id, email
  // For example: {"user_id_type": ["open_id", "union_id"]}
  user_id_type: z
    .array(z.enum(["user_id", "open_id", "union_id", "email"]))
    .optional(),
})

export type CalendarBatchGetPrimaryQueryParams = z.infer<
  typeof calendarBatchGetPrimaryQueryParamsSchema
>
export type CalendarBatchGetPrimaryBody = z.infer<
  typeof calendarBatchGetPrimaryBodySchema
>

export function parseCalendarBatchGetPrimaryQueryParams(
  obj: unknown,
): CalendarBatchGetPrimaryQueryParams {
  return calendarBatchGetPrimaryQueryParamsSchema.parse(obj)
}

export function parseCalendarBatchGetPrimaryBody(
  obj: unknown,
): CalendarBatchGetPrimaryBody {
  return calendarBatchGetPrimaryBodySchema.parse(obj)
}
