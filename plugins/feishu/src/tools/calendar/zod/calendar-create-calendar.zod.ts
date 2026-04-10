/**
 * 飞书「创建共享日历」POST /open-apis/calendar/v4/calendars
 * 请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/calendar-v4/calendar/create
 */
import { z } from "zod"
import {
  calendarPermissionsSchema,
  calendarVisibilitySchema,
} from "./calendar-shared.zod"

/** 请求体 */
export const calendarCreateCalendarBodySchema = z
  .object({
    summary: z.string().optional(),
    description: z.string().optional(),
    permissions: calendarPermissionsSchema.optional(),
    color: z.number().int().optional(),
    summary_alias: z.string().optional(),
    default_view: calendarVisibilitySchema.optional(),
    enable_outside_enterprise: z.boolean().optional(),
  })
  .strict()

export type CalendarCreateCalendarBody = z.infer<
  typeof calendarCreateCalendarBodySchema
>

export function parseCalendarCreateCalendarBody(
  raw: Record<string, unknown>,
): CalendarCreateCalendarBody {
  return calendarCreateCalendarBodySchema.parse(raw)
}
