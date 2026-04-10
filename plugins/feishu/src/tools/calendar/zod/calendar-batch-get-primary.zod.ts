import { z } from "zod"

/**
 * Schema for query parameters for batch getting primary calendars
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/calendar-primary/batch_get
 */
export const calendarBatchGetPrimaryQueryParamsSchema = z.object({
  // user_id_type: The type of user ID. Optional. Valid values: open_id, union_id, user_id
  user_id_type: z.enum(["open_id", "union_id", "user_id"]).optional(),
}).strict()

/**
 * Schema for request body for batch getting primary calendars
 * POST request with user_id_type array
 */
export const calendarBatchGetPrimaryBodySchema = z.object({
  // user_ids: Required. User ID list.
  // For example: {"user_ids": ["ou_xxx", "ou_yyy"]}
  user_ids: z.array(z.string()).min(1).max(10),
}).strict()

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
