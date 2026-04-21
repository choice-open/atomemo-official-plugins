import { Client } from "@hubspot/api-client"
import type { ToolArgs } from "./types"

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
 * Resolve a resource_mapper value to a properties object.
 */
export function resolveResourceMapper(
  params: Record<string, unknown>,
  key: string,
): Record<string, string> | undefined {
  const v = params[key]
  if (!v || typeof v !== "object") return undefined

  // Direct object of key-value pairs
  if (!("mapping_mode" in v)) {
    return v as Record<string, string>
  }

  const mapper = v as { mapping_mode: string; value: unknown }
  if (mapper.value && typeof mapper.value === "object") {
    return mapper.value as Record<string, string>
  }
  if (typeof mapper.value === "string") {
    try {
      return JSON.parse(mapper.value) as Record<string, string>
    } catch {
      return undefined
    }
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
