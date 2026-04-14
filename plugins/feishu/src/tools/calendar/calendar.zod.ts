import { z } from "zod"

const userIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

/** 仅包含飞书日历 v4 常见查询参数；未知字段会触发 strict 校验失败 */
const calendarUserIdQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const calendarListQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
    page_size: z.number().int().positive().optional(),
    page_token: z.string().optional(),
    sync_token: z.string().optional(),
  })
  .strict()

export function parseCalendarCreateSharedCalendarQuery(
  raw: Record<string, unknown>,
) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarDeleteCalendarQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarGetPrimaryQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarBatchGetPrimaryQuery(
  raw: Record<string, unknown>,
) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarGetCalendarQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarBatchGetCalendarsQuery(
  raw: Record<string, unknown>,
) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarListCalendarsQuery(raw: Record<string, unknown>) {
  return calendarListQuerySchema.parse(raw)
}

export function parseCalendarPatchCalendarQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarSearchCalendarsQuery(
  raw: Record<string, unknown>,
) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarCreateEventQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarDeleteEventQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarPatchEventQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarGetEventQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarListEventsQuery(raw: Record<string, unknown>) {
  return calendarListQuerySchema.parse(raw)
}

export function parseCalendarSearchEventsQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}
