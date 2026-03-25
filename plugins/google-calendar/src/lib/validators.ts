import { z } from "zod"

const RFC3339_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const IANA_TZ_RE = /^[A-Za-z_]+\/[A-Za-z_\-\/]+$/

function isValidDate(value: string): boolean {
  const d = new Date(value)
  return !Number.isNaN(d.getTime())
}

export const rfc3339Schema = z
  .string()
  .regex(
    RFC3339_RE,
    "Must be RFC3339 format with timezone offset, e.g. 2025-03-18T09:00:00+08:00 or 2025-03-18T01:00:00Z",
  )
  .refine(isValidDate, "Invalid date/time value")

export const dateOnlySchema = z
  .string()
  .regex(DATE_RE, "Must be yyyy-mm-dd format, e.g. 2025-03-18")
  .refine(isValidDate, "Invalid date value")

export const ianaTimezoneSchema = z
  .string()
  .regex(
    IANA_TZ_RE,
    "Must be an IANA timezone name, e.g. Asia/Shanghai, America/Los_Angeles",
  )

export const optionalRfc3339Schema = z
  .union([rfc3339Schema, z.literal(""), z.null(), z.undefined()])
  .transform((v) => v || undefined)

export const optionalDateOnlySchema = z
  .union([dateOnlySchema, z.literal(""), z.null(), z.undefined()])
  .transform((v) => v || undefined)

export const optionalIanaTimezoneSchema = z
  .union([ianaTimezoneSchema, z.literal(""), z.null(), z.undefined()])
  .transform((v) => v || undefined)

export function parseTimeRange(timeMin: unknown, timeMax: unknown) {
  const min = optionalRfc3339Schema.parse(timeMin)
  const max = optionalRfc3339Schema.parse(timeMax)
  if (min && max && new Date(min) >= new Date(max)) {
    throw new Error("time_min must be earlier than time_max")
  }
  return { timeMin: min, timeMax: max }
}

export function parseRequiredTimeRange(timeMin: unknown, timeMax: unknown) {
  const min = rfc3339Schema.parse(timeMin)
  const max = rfc3339Schema.parse(timeMax)
  if (new Date(min) >= new Date(max)) {
    throw new Error("time_min must be earlier than time_max")
  }
  return { timeMin: min, timeMax: max }
}
