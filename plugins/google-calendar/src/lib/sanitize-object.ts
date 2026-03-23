import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"

/**
 * Sanitizes a value to JSON-serializable form (JsonValue).
 * - Primitives (string, number, boolean, null) pass through
 * - Arrays and plain objects are recursively sanitized
 * - Date → ISO 8601 string
 * - undefined, symbol, function, bigint, etc. → null
 */
export function sanitizeObject(obj: unknown): JsonValue {
  if (obj === null || obj === undefined) {
    return null
  }

  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return obj
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item))
  }

  if (typeof obj === "object") {
    const result: Record<string, JsonValue> = {}
    const source = obj as Record<string, unknown>
    for (const key of Object.keys(source)) {
      result[key] = sanitizeObject(source[key])
    }
    return result
  }

  return null
}