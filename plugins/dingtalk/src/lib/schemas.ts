import { prettifyError, z } from "zod"

function emptyToUndefined(val: unknown): unknown {
  if (val === undefined || val === null) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}

function toTimestampValue(val: unknown): number | undefined {
  if (val === undefined || val === null || val === "") return undefined
  if (typeof val === "number") return val
  if (typeof val === "string") {
    const t = val.trim()
    if (!t) return undefined
    const n = Number(t)
    if (!Number.isNaN(n)) return n
    const d = new Date(t).getTime()
    return Number.isNaN(d) ? undefined : d
  }
  return undefined
}

type DateBoundary = "start" | "end"

const DATETIME_INPUT_ERROR =
  "Invalid date/time. Use a Unix millisecond timestamp or an absolute date/time like 2026-04-15, 2026-04-15 14:30, 2026/04/15 14:30:00, 2026-04-15T14:30:00+08:00, April 15, 2026 2:30 PM, or 2026年4月15日 14:30."

const ENGLISH_MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
} as const satisfies Record<string, number>

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function normalizeMilliseconds(value?: string): number {
  if (!value) return 0
  if (value.length >= 3) return Number(value.slice(0, 3))
  return Number(value.padEnd(3, "0"))
}

function hasValidDateParts(year: number, month: number, day: number): boolean {
  const candidate = new Date(year, month - 1, day)
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  )
}

function hasValidTimeParts(
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
): boolean {
  return (
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59 &&
    millisecond >= 0 &&
    millisecond <= 999
  )
}

function buildLocalTimestamp(
  year: number,
  month: number,
  day: number,
  boundary: DateBoundary,
  time?: {
    hour: number
    minute: number
    second?: number
    millisecond?: number
  },
): number | undefined {
  if (!hasValidDateParts(year, month, day)) return undefined

  const hour = time?.hour ?? (boundary === "start" ? 0 : 23)
  const minute = time?.minute ?? (boundary === "start" ? 0 : 59)
  const second = time?.second ?? (boundary === "start" ? 0 : 59)
  const millisecond = time?.millisecond ?? (boundary === "start" ? 0 : 999)

  if (!hasValidTimeParts(hour, minute, second, millisecond)) return undefined

  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond,
  ).getTime()
}

function normalizeTimezone(timezone: string): string {
  if (timezone === "Z") return timezone
  return /[+-]\d{2}:\d{2}/.test(timezone)
    ? timezone
    : `${timezone.slice(0, 3)}:${timezone.slice(3)}`
}

function buildUtcTimestamp(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  timezone: string,
): number | undefined {
  if (!hasValidDateParts(year, month, day)) return undefined
  if (!hasValidTimeParts(hour, minute, second, millisecond)) return undefined

  const iso =
    `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` +
    `T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.` +
    `${String(millisecond).padStart(3, "0")}${normalizeTimezone(timezone)}`

  const parsed = new Date(iso).getTime()
  return Number.isNaN(parsed) ? undefined : parsed
}

function parseYearFirstDateTime(
  value: string,
  boundary: DateBoundary,
): number | undefined {
  const dateOnlyMatch = value.match(/^(\d{4})([-/.])(\d{1,2})\2(\d{1,2})$/)
  if (dateOnlyMatch) {
    const [, year, , month, day] = dateOnlyMatch
    return buildLocalTimestamp(
      Number(year),
      Number(month),
      Number(day),
      boundary,
    )
  }

  const dateTimeMatch = value.match(
    /^(\d{4})([-/.])(\d{1,2})\2(\d{1,2})[T\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/,
  )
  if (!dateTimeMatch) return undefined

  const [, year, , month, day, hour, minute, second, millisecond, timezone] =
    dateTimeMatch

  if (timezone) {
    return buildUtcTimestamp(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      second ? Number(second) : 0,
      normalizeMilliseconds(millisecond),
      timezone,
    )
  }

  return buildLocalTimestamp(
    Number(year),
    Number(month),
    Number(day),
    boundary,
    {
      hour: Number(hour),
      minute: Number(minute),
      second: second ? Number(second) : 0,
      millisecond: normalizeMilliseconds(millisecond),
    },
  )
}

function parseChineseDateTime(
  value: string,
  boundary: DateBoundary,
): number | undefined {
  if (!(value.includes("年") && value.includes("月"))) return undefined

  const normalized = value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/年/g, "-")
    .replace(/月/g, "-")
    .replace(/日/g, "")
    .replace(/时/g, ":")
    .replace(/分/g, ":")
    .replace(/秒/g, "")
    .replace(/\s*:\s*/g, ":")
    .replace(/:\s*$/, "")
    .trim()

  return parseYearFirstDateTime(normalized, boundary)
}

function parseEnglishMonthDateTime(
  value: string,
  boundary: DateBoundary,
): number | undefined {
  const monthMatch = value.match(
    /^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:,)?\s+(\d{4})(?:\s+(.+))?$/i,
  )
  if (!monthMatch) return undefined

  const [, monthName, day, year, timePart] = monthMatch
  const month =
    ENGLISH_MONTHS[monthName.toLowerCase() as keyof typeof ENGLISH_MONTHS]
  if (month === undefined) return undefined

  if (!timePart) {
    return buildLocalTimestamp(Number(year), month + 1, Number(day), boundary)
  }

  const timeMatch = timePart.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?\s*(AM|PM)?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/i,
  )
  if (!timeMatch) return undefined

  const [, rawHour, minute, second, millisecond, meridiem, timezone] = timeMatch
  let hour = Number(rawHour)

  if (meridiem) {
    if (hour < 1 || hour > 12) return undefined
    const upperMeridiem = meridiem.toUpperCase()
    hour = hour % 12
    if (upperMeridiem === "PM") hour += 12
  }

  if (timezone) {
    return buildUtcTimestamp(
      Number(year),
      month + 1,
      Number(day),
      hour,
      Number(minute),
      second ? Number(second) : 0,
      normalizeMilliseconds(millisecond),
      timezone,
    )
  }

  return buildLocalTimestamp(Number(year), month + 1, Number(day), boundary, {
    hour,
    minute: Number(minute),
    second: second ? Number(second) : 0,
    millisecond: normalizeMilliseconds(millisecond),
  })
}

function resolveAbsoluteDateTimeValue(
  value: unknown,
  boundary: DateBoundary,
): number | undefined {
  if (value === undefined || value === null || value === "") return undefined

  if (isFiniteNumber(value)) return value

  if (typeof value !== "string") return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed)
    return Number.isFinite(numeric) ? numeric : undefined
  }

  return (
    parseChineseDateTime(trimmed, boundary) ??
    parseYearFirstDateTime(trimmed, boundary) ??
    parseEnglishMonthDateTime(trimmed, boundary)
  )
}

function dateTimeRangeSchema(
  boundary: DateBoundary,
  options: { optional: boolean },
) {
  return z.unknown().transform((value, ctx) => {
    if (value === undefined || value === null || value === "") {
      if (options.optional) return undefined
      ctx.addIssue({
        code: "custom",
        message: DATETIME_INPUT_ERROR,
      })
      return z.NEVER
    }

    const resolved = resolveAbsoluteDateTimeValue(value, boundary)
    if (resolved === undefined) {
      ctx.addIssue({
        code: "custom",
        message: DATETIME_INPUT_ERROR,
      })
      return z.NEVER
    }

    return resolved
  })
}

/** Trimmed non-empty string. */
export const nonEmptyString = z.string().trim().min(1, "Must not be empty")

/** Optional string: empty or absent input becomes undefined; non-empty is trimmed. */
export const optionalTrimmedString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional(),
)

/**
 * Coerces a value to a number (for integer fields).
 * Use `.default(n)` to supply a fallback for absent/null inputs.
 */
export const coercedNumber = z.preprocess(
  (v) => (v == null || v === "" ? undefined : Number(v)),
  z.number(),
)

/** Non-empty string array; non-array inputs (including absent) become []. */
export const stringArray = z.preprocess(
  (v) => (Array.isArray(v) ? v : []),
  z.array(z.string()),
)

/**
 * Optional string array: absent/non-array/empty-array all become undefined.
 * Non-empty arrays are passed through.
 */
export const optionalStringArray = z.preprocess(
  (v) => (Array.isArray(v) && v.length > 0 ? v : undefined),
  z.array(z.string()).optional(),
)

/**
 * Coerced boolean with null/undefined → false fallback.
 * Accepts actual boolean values from UI switch/checkbox components.
 */
export const coercedBool = z.preprocess(
  (v) => (v == null ? false : v),
  z.boolean(),
)

/**
 * Optional timestamp: number (ms), numeric string, or ISO date string → number.
 * Absent/empty/invalid inputs become undefined.
 */
export const timestampMs = z.preprocess(toTimestampValue, z.number().optional())

/**
 * Required timestamp: same coercion as `timestampMs` but rejects absent/invalid
 * inputs with a Zod validation error.
 */
export const requiredTimestampMs = z.preprocess(toTimestampValue, z.number())

/** Required absolute datetime for range starts. */
export const requiredDateTimeRangeStartMs: z.ZodType<number> =
  dateTimeRangeSchema("start", {
    optional: false,
  }) as z.ZodType<number>

/** Optional absolute datetime for range ends. */
export const optionalDateTimeRangeEndMs: z.ZodType<number | undefined> =
  dateTimeRangeSchema("end", {
    optional: true,
  }) as z.ZodType<number | undefined>

/**
 * Parse `args.parameters` through a Zod schema.
 * Throws a human-readable error (via `prettifyError`) on validation failure.
 */
export function parseParams<T extends z.ZodTypeAny>(
  schema: T,
  raw: unknown,
): z.infer<T> {
  const result = schema.safeParse(raw)
  if (!result.success) {
    throw new Error(prettifyError(result.error))

  }
  return result.data
}
