import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./calendar-shared.zod"

const objectBodySchema = z.record(z.string(), z.unknown())

export const calendarActionQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .passthrough()

export const calendarActionBodySchema = objectBodySchema
export const calendarEmptyBodySchema = emptyBodyStrictSchema

export function parseCalendarActionQuery(raw: Record<string, unknown>) {
  return calendarActionQuerySchema.parse(raw)
}

export function parseCalendarActionBody(raw: Record<string, unknown>) {
  return calendarActionBodySchema.parse(raw)
}

export function parseCalendarEmptyBody(raw: Record<string, unknown>) {
  return calendarEmptyBodySchema.parse(raw) as Record<string, never>
}
