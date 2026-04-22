import {
  extractResourceLocator,
  extractResourceMapper,
} from "@choiceopen/atomemo-plugin-sdk-js"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { Client } from "@hubspot/api-client"
import type { ToolArgs } from "./types"

type KeyValueEntryLike = {
  key?: unknown
  value?: unknown
}

/**
 * Create an authenticated HubSpot SDK client from tool args.
 * Uses the configured OAuth2 credential.
 */
export function getHubSpotClient(args: ToolArgs): Client {
  const params = args.parameters
  const credentials = args.credentials ?? {}

  const oauth2CredId = params.hubspot_oauth2_credential as string | undefined
  if (oauth2CredId && credentials[oauth2CredId]) {
    const token = credentials[oauth2CredId].access_token
    if (token) return new Client({ accessToken: String(token) })
  }

  throw new Error(
    "Missing HubSpot credential. Please provide a HubSpot OAuth2 credential.",
  )
}

/**
 * Normalize HubSpot SDK errors into a consistent message format.
 */
export function handleHubSpotError(error: unknown): never {
  if (error instanceof Error) {
    // SDK HttpError contains a response body
    const body = (error as any).body
    if (body && typeof body === "object") {
      const message = body.message ?? error.message
      const parts = [message]
      if (body.category) parts.push(`category: ${body.category}`)
      if (body.correlationId) parts.push(`correlationId: ${body.correlationId}`)
      throw new Error(parts.join(" | "))
    }
    throw error
  }
  throw new Error(String(error))
}

/**
 * Convert SDK model instances into plain JSON-safe data for Atomemo tool results.
 */
export function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue
}

/**
 * Safely extract a string parameter.
 */
export function getString(
  params: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = params[key]
  return typeof v === "string" && v.length > 0 ? v : undefined
}

/**
 * Safely extract a resource locator value or plain string fallback.
 */
export function getResourceLocatorValue(
  params: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = params[key]
  if (typeof v === "string") {
    const trimmed = v.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }
  if (!v) return undefined

  try {
    const extracted = extractResourceLocator(v)
    if (typeof extracted !== "string") return undefined
    const trimmed = extracted.trim()
    return trimmed.length > 0 ? trimmed : undefined
  } catch {
    return undefined
  }
}

/**
 * Safely extract a number parameter.
 */
export function getNumber(
  params: Record<string, unknown>,
  key: string,
): number | undefined {
  const v = params[key]
  if (typeof v === "number") return v
  if (typeof v === "string" && v.length > 0) {
    const n = Number(v)
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

/**
 * Safely extract a boolean parameter.
 */
export function getBoolean(
  params: Record<string, unknown>,
  key: string,
): boolean | undefined {
  const v = params[key]
  if (typeof v === "boolean") return v
  if (v === "true") return true
  if (v === "false") return false
  return undefined
}

/**
 * Safely extract a list of strings from an array parameter.
 * Falls back to comma-separated strings for backward compatibility.
 */
export function getStringArray(
  params: Record<string, unknown>,
  key: string,
): string[] | undefined {
  const v = params[key]
  if (Array.isArray(v)) {
    const values = v
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
    return values.length > 0 ? values : undefined
  }

  if (typeof v === "string" && v.length > 0) {
    const values = v
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    return values.length > 0 ? values : undefined
  }

  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeObjectStringValues(
  value: Record<string, unknown>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, typeof item === "string" ? item : String(item)])
      .filter(([key]) => key.trim().length > 0),
  )
}

function normalizeObjectValues(
  value: Record<string, unknown>,
): Record<string, any> | undefined {
  const entries = Object.entries(value).filter(([key]) => key.trim().length > 0)
  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

/**
 * Resolve a key/value editor payload, legacy JSON string, or plain object into a string map.
 */
export function resolveStringMap(
  value: unknown,
): Record<string, string> | undefined {
  if (!value) return undefined

  if (typeof value === "string") {
    try {
      return resolveStringMap(JSON.parse(value))
    } catch {
      return undefined
    }
  }

  if (Array.isArray(value)) {
    const entries = value
      .map((item) => {
        if (!item || typeof item !== "object") return undefined
        const { key, value: entryValue } = item as KeyValueEntryLike
        if (typeof key !== "string" || key.trim().length === 0) return undefined
        return [
          key.trim(),
          typeof entryValue === "string" ? entryValue : String(entryValue ?? ""),
        ] as const
      })
      .filter(
        (entry): entry is readonly [string, string] => entry !== undefined,
      )

    return entries.length > 0
      ? Object.fromEntries(entries)
      : undefined
  }

  if (isRecord(value)) {
    return normalizeObjectStringValues(value)
  }

  return undefined
}

/**
 * Resolve a resource_mapper value to a properties object.
 */
export function resolveResourceMapper(
  params: Record<string, unknown>,
  key: string,
): Record<string, any> | undefined {
  const v = params[key]
  if (!v) return undefined

  if (isRecord(v) && !("mapping_mode" in v)) {
    return normalizeObjectValues(v)
  }

  try {
    const extracted = extractResourceMapper(v)
    return extracted && isRecord(extracted)
      ? normalizeObjectValues(extracted)
      : undefined
  } catch {
    // Fall through to legacy parsing for previously saved string-based payloads.
  }

  if (typeof v === "string") {
    try {
      return resolveResourceMapper({ [key]: JSON.parse(v) }, key)
    } catch {
      return undefined
    }
  }

  if (isRecord(v) && "value" in v) {
    const mapperValue = v.value
    if (typeof mapperValue === "string") {
      try {
        return resolveResourceMapper({ [key]: JSON.parse(mapperValue) }, key)
      } catch {
        return undefined
      }
    }

    return isRecord(mapperValue)
      ? normalizeObjectValues(mapperValue)
      : undefined
  }

  return undefined
}

/**
 * Resolve search filters from an array parameter.
 */
export function resolveFilters(
  params: Record<string, unknown>,
  key: string,
):
  | Array<{
    filters: Array<{ propertyName: string; operator: string; value?: string }>
  }>
  | undefined {
  const v = params[key]
  if (!Array.isArray(v) || v.length === 0) return undefined
  return v as Array<{
    filters: Array<{ propertyName: string; operator: string; value?: string }>
  }>
}
