export function parseCsvList(value: unknown): string[] | undefined {
  if (value == null) return undefined
  if (Array.isArray(value)) {
    const parts = value.map(String).map((s) => s.trim()).filter(Boolean)
    return parts.length ? parts : undefined
  }
  if (typeof value !== "string") return undefined

  const parts = value
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean)

  return parts.length ? parts : undefined
}

export function parseJsonObject(value: unknown): Record<string, unknown> | undefined {
  if (value == null) return undefined
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>
  if (typeof value !== "string") return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  const parsed = JSON.parse(trimmed) as unknown
  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected a JSON object")
  }
  return parsed as Record<string, unknown>
}

export function getTavilyApiKeyFromCredentials(
  credentials: unknown,
  credentialName: string = "tavily",
): string | null {
  if (credentials == null || typeof credentials !== "object") return null
  const record = credentials as Record<string, unknown>
  const tavily = record[credentialName] as Record<string, unknown> | undefined
  const apiKey = tavily?.["api_key"]
  if (typeof apiKey === "string" && apiKey.trim()) return apiKey.trim()

  // Fallback: if the host passes credentials with different top-level keys, grab the first api_key we see.
  for (const value of Object.values(record)) {
    if (value && typeof value === "object") {
      const candidate = (value as Record<string, unknown>)["api_key"]
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim()
    }
  }

  return null
}

export function replaceUndefinedWithNull<T>(value: T): T {
  if (value === undefined) return null as T

  if (Array.isArray(value)) {
    return value.map((item) => replaceUndefinedWithNull(item)) as T
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      replaceUndefinedWithNull(item),
    ])

    return Object.fromEntries(entries) as T
  }

  return value
}

