/**
 * 飞书「查询 Exchange 绑定状态」GET /open-apis/calendar/v4/exchange_bindings
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./calendar-shared.zod"

export const calendarListExchangeBindingsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const calendarListExchangeBindingsBodySchema = emptyBodyStrictSchema

export type CalendarListExchangeBindingsQuery = z.infer<
  typeof calendarListExchangeBindingsQuerySchema
>

export function parseCalendarListExchangeBindingsQuery(
  raw: Record<string, unknown>,
): CalendarListExchangeBindingsQuery {
  return calendarListExchangeBindingsQuerySchema.parse(raw)
}

export function parseCalendarListExchangeBindingsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return calendarListExchangeBindingsBodySchema.parse(raw) as Record<string, never>
}
