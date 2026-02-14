type UnknownRecord = Record<string, unknown>

const FIRECRAWL_API_BASE = "https://api.firecrawl.dev/v2"

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
    const message = error instanceof Error ? error.message : "unknown parse error"
    throw new Error(`Invalid JSON in ${fieldName}: ${message}`)
  }
}

function normalizeProxy(body: UnknownRecord): void {
  if (body.proxy === "stealth") {
    body.proxy = "enhanced"
  }
}

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

function sanitizeBody(body: UnknownRecord): UnknownRecord {
  const output: UnknownRecord = {}
  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined) {
      output[key] = value
    }
  }

  if ("scrapeOptions" in output) {
    const scrapeOptions = asObject(output.scrapeOptions)
    scrapeOptions.formats = normalizeFormats(scrapeOptions.formats)
    normalizeProxy(scrapeOptions)
    output.scrapeOptions = scrapeOptions
  }

  if ("formats" in output) {
    output.formats = normalizeFormats(output.formats)
  }

  if ("parsers" in output) {
    output.parsers = normalizeParsers(output.parsers)
  }

  normalizeProxy(output)
  return output
}

export function getArgs(context: unknown): {
  parameters: UnknownRecord
  credentials: UnknownRecord
} {
  const ctx = asObject(context)
  const args = asObject(ctx.args)
  return {
    parameters: asObject(args.parameters),
    credentials: asObject(args.credentials),
  }
}

export async function getFirecrawlApiKey(context: unknown): Promise<string> {
  const ctx = asObject(context)
  const { parameters, credentials } = getArgs(context)

  if (typeof credentials.api_key === "string" && credentials.api_key.trim()) {
    return credentials.api_key
  }

  const credentialIdCandidate =
    parameters.credentialId ?? parameters.credential_id ?? parameters.credentialID
  const credentialId =
    typeof credentialIdCandidate === "string" ? credentialIdCandidate : undefined

  if (typeof ctx.getCredential === "function" && credentialId) {
    const resolved = asObject(await ctx.getCredential(credentialId))
    if (typeof resolved.api_key === "string" && resolved.api_key.trim()) {
      return resolved.api_key
    }
  }

  const nestedCandidates = [credentials.firecrawl, credentials.credential]
  for (const candidate of nestedCandidates) {
    const candidateObj = asObject(candidate)
    if (
      typeof candidateObj.api_key === "string" &&
      candidateObj.api_key.trim().length > 0
    ) {
      return candidateObj.api_key
    }
  }

  throw new Error(
    "Missing Firecrawl API key in credential. Please select a valid Firecrawl credential.",
  )
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

export async function firecrawlRequest(params: {
  apiKey: string
  method: "GET" | "POST" | "DELETE"
  path: string
  body?: UnknownRecord
}): Promise<any> {
  const response = await fetch(`${FIRECRAWL_API_BASE}${params.path}`, {
    method: params.method,
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: params.body ? JSON.stringify(sanitizeBody(params.body)) : undefined,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const payload = asObject(data)
    const message =
      (typeof payload.error === "string" && payload.error) ||
      (typeof payload.message === "string" && payload.message) ||
      response.statusText
    throw new Error(`Firecrawl API error (${response.status}): ${message}`)
  }

  return data
}

/**
 * Build a JSON-serializable error object for tool responses.
 * Tools should return this instead of throwing so callers get a consistent structure.
 */
export function errorResponse(error: unknown): Record<string, unknown> {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error")
  return { success: false, error: message }
}
