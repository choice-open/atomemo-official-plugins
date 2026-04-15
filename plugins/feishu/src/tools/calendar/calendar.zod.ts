import { z } from "zod"

const userIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])
const booleanStringSchema = z.enum(["true", "false"])
const intStringSchema = z
  .string()
  .regex(/^\d+$/)

/** 仅包含飞书日历 v4 常见查询参数；未知字段会触发 strict 校验失败 */
const emptyQuerySchema = z.object({}).strict()

const calendarUserIdQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const calendarListCalendarsQuerySchema = z
  .object({
    page_size: intStringSchema.optional(),
    page_token: z.string().optional(),
    sync_token: z.string().optional(),
  })
  .strict()

const calendarSearchCalendarsQuerySchema = z
  .object({
    page_size: intStringSchema.optional(),
    page_token: z.string().optional(),
  })
  .strict()

const calendarCreateEventQuerySchema = z
  .object({
    idempotency_key: z.string().optional(),
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const calendarDeleteEventQuerySchema = z
  .object({
    need_notification: booleanStringSchema.optional(),
  })
  .strict()

const calendarGetEventQuerySchema = z
  .object({
    need_meeting_settings: booleanStringSchema.optional(),
    need_attendee: booleanStringSchema.optional(),
    max_attendee_num: intStringSchema.optional(),
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const calendarListEventsQuerySchema = z
  .object({
    page_size: intStringSchema.optional(),
    anchor_time: z.string().optional(),
    page_token: z.string().optional(),
    sync_token: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const calendarSearchEventsQuerySchema = z
  .object({
    page_size: intStringSchema.optional(),
    page_token: z.string().optional(),
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

export function parseCalendarCreateSharedCalendarQuery(
  raw: Record<string, unknown>,
) {
  return emptyQuerySchema.parse(raw)
}

export function parseCalendarDeleteCalendarQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
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
  return emptyQuerySchema.parse(raw)
}

export function parseCalendarBatchGetCalendarsQuery(
  raw: Record<string, unknown>,
) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarListCalendarsQuery(raw: Record<string, unknown>) {
  return calendarListCalendarsQuerySchema.parse(raw)
}

export function parseCalendarPatchCalendarQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}

export function parseCalendarSearchCalendarsQuery(
  raw: Record<string, unknown>,
) {
  return calendarSearchCalendarsQuerySchema.parse(raw)
}

export function parseCalendarCreateEventQuery(raw: Record<string, unknown>) {
  return calendarCreateEventQuerySchema.parse(raw)
}

export function parseCalendarDeleteEventQuery(raw: Record<string, unknown>) {
  return calendarDeleteEventQuerySchema.parse(raw)
}

export function parseCalendarPatchEventQuery(raw: Record<string, unknown>) {
  return calendarUserIdQuerySchema.parse(raw)
}

export function parseCalendarGetEventQuery(raw: Record<string, unknown>) {
  return calendarGetEventQuerySchema.parse(raw)
}

export function parseCalendarListEventsQuery(raw: Record<string, unknown>) {
  return calendarListEventsQuerySchema.parse(raw)
}

export function parseCalendarSearchEventsQuery(raw: Record<string, unknown>) {
  return calendarSearchEventsQuerySchema.parse(raw)
}
