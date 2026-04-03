import { prettifyError, type ZodType } from "zod"

export function parseParameters<T extends ZodType>(
  schema: T,
  raw: unknown,
): import("zod").infer<T> {
  const result = schema.safeParse(raw)
  if (!result.success) {
    throw new Error(prettifyError(result.error))
  }
  return result.data
}
