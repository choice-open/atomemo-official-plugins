import { z } from "zod"
import { emptyBodyStrictSchema } from "./calendar-shared.zod"

/**
 * Schema for query parameters for getting an event
 * Based on: https://open.feishu.cn/document/ukTMukTMukTM/uMzM1YjLzMTN24yMzUjN/calendar-v4/event/get
 */
export const calendarGetEventQueryParamsSchema = z.object({
  need_notification: z.boolean().optional(),
  max_attendee_num: z.number().int().max(100).optional(),
  // According to the Feishu API documentation, this endpoint supports:
  // user_id_type: The type of user ID. Optional. Valid values: user_id, open_id, union_id
  // For example: {"user_id_type": "open_id"}
  user_id_type: z.enum(["user_id", "open_id", "union_id"]).optional(),
}).strict()

/**
 * Schema for request body for getting an event
 * GET requests should not have a body
 */
export const calendarGetEventBodySchema = emptyBodyStrictSchema

export type CalendarGetEventQueryParams = z.infer<
  typeof calendarGetEventQueryParamsSchema
>
export type CalendarGetEventBody = z.infer<typeof calendarGetEventBodySchema>

export function parseCalendarGetEventQueryParams(
  obj: unknown,
): CalendarGetEventQueryParams {
  return calendarGetEventQueryParamsSchema.parse(obj)
}

export function parseCalendarGetEventBody(obj: unknown): CalendarGetEventBody {
  return calendarGetEventBodySchema.parse(obj)
}
