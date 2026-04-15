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
