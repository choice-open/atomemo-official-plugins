import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { FirecrawlClient } from "@mendable/firecrawl-js"

type UnknownRecord = Record<string, unknown>

/**
 * Create a Firecrawl v2 client for the given API key.
 * Use this in tools and call the appropriate SDK methods (scrape, startCrawl, etc.).
 */
export function createFirecrawlClient(apiKey: string): FirecrawlClient {
  return new FirecrawlClient({ apiKey })
}

function asObject(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {}
}

function parseJsonObject(value: unknown, fieldName: string): UnknownRecord {
  if (value == null || value === "") {
    return {}
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as UnknownRecord
  }
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a JSON object string`)
  }

  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("parsed value is not an object")
    }
    return parsed as UnknownRecord
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown parse error"
    throw new Error(`Invalid JSON in ${fieldName}: ${message}`)
  }
}

// function normalizeProxy(body: UnknownRecord): void {
//   if (body.proxy === "stealth") {
//     body.proxy = "enhanced";
//   }
// }

function normalizeFormats(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value
  }

  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return item
    }
    const format = { ...(item as UnknownRecord) }
    if (format.type === "json" || format.type === "changeTracking") {
      if (typeof format.schema === "string") {
        format.schema = parseJsonObject(format.schema, "formats[*].schema")
      }
    }
    return format
  })
}

function normalizeParsers(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value
  }

  return value.map((item) => {
    if (typeof item === "string") {
      return { type: item }
    }
    return item
  })
}

function normalizeActions(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value
  }

  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return item
    }
    const action = item as UnknownRecord
    if (action.type !== "wait") {
      return item
    }
    const out = { ...action }
    if (out.selector === "") {
      delete out.selector
    }
    if (out.milliseconds === 0) {
      delete out.milliseconds
    }
    return out
  })
}

/**
 * Recursively remove any key (in objects) or element (in arrays) whose value is null.
 * Returns a new structure; does not mutate the input.
 */
function removeNullsDeep(value: unknown): unknown {
  if (value === null) {
    return null // leave as-is so callers can filter; for object keys we skip adding
  }
  if (Array.isArray(value)) {
    return value.map(removeNullsDeep).filter((el) => el !== null)
  }
  if (value && typeof value === "object") {
    const obj = value as UnknownRecord
    const result: UnknownRecord = {}
    for (const [key, val] of Object.entries(obj)) {
      if (val === null) continue
      const cleaned = removeNullsDeep(val)
      result[key] = cleaned
    }
    return result
  }
  return value
}

function sanitizeBody(body: UnknownRecord): UnknownRecord {
  const noNulls = removeNullsDeep(body) as UnknownRecord
  const output: UnknownRecord = {}
  for (const [key, value] of Object.entries(noNulls)) {
    if (value !== undefined) {
      output[key] = value
    }
  }

  if ("scrapeOptions" in output) {
    const scrapeOptions = asObject(output.scrapeOptions)
    scrapeOptions.formats = normalizeFormats(scrapeOptions.formats)
    scrapeOptions.actions = normalizeActions(scrapeOptions.actions)
    // normalizeProxy(scrapeOptions);
    output.scrapeOptions = scrapeOptions
  }

  if ("actions" in output) {
    output.actions = normalizeActions(output.actions)
  }

  if ("formats" in output) {
    output.formats = normalizeFormats(output.formats)
  }

  if ("parsers" in output) {
    output.parsers = normalizeParsers(output.parsers)
  }

  // normalizeProxy(output);
  return output
}

export function getArgs(argsInput: unknown): {
  parameters: UnknownRecord
  credentials: UnknownRecord
} {
  const args = asObject(argsInput)
  return {
    parameters: asObject(args.parameters),
    credentials: asObject(args.credentials),
  }
}

export type FirecrawlToolArgs = {
  parameters: Record<string, unknown>
  credentials?: Record<string, { api_key: string }>
}

/**
 * Resolves the Firecrawl API key using the credential referenced by
 * parameters[credentialIdParamKey]. Follows Atomemo credential usage:
 * credential = credentials[parameters[credentialIdParamKey]]
 */
export function getFirecrawlApiKey(
  args: FirecrawlToolArgs,
  credentialIdParamKey: string = "credentialId",
): string | null {
  const credentials = args.credentials
  if (!credentials || typeof credentials !== "object") {
    return null
  }

  const credentialId = args.parameters[credentialIdParamKey]
  if (typeof credentialId !== "string" || credentialId.trim() === "") {
    return null
  }

  const credential = credentials[credentialId]
  const apiKey = credential?.api_key
  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return null
  }

  return apiKey
}

export function parseCustomBody(raw: unknown): UnknownRecord {
  return sanitizeBody(parseJsonObject(raw, "customBody"))
}

export function parseUrlsText(raw: unknown): string[] {
  if (typeof raw !== "string") {
    return []
  }
  return raw
    .split(/\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function withSchemaObject(raw: unknown): UnknownRecord {
  return parseJsonObject(raw, "schema")
}

export function sanitizeRequestBody(body: UnknownRecord): UnknownRecord {
  return sanitizeBody(body)
}

/**
 * Cast a promise of an API response to the tool result type (Promise<JsonValue>).
 * Firecrawl SDK response types lack index signatures, so TypeScript does not
 * consider them assignable to JsonValue; this helper asserts they are JSON-serializable.
 */
export function asToolResult<T>(promise: Promise<T>): Promise<JsonValue> {
  return promise as Promise<JsonValue>
}

/**
 * Build a JSON-serializable error object for tool responses.
 * Tools should return this instead of throwing so callers get a consistent structure.
 */
export function errorResponse(error: unknown): JsonValue {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error")
  return { success: false, error: message }
}
