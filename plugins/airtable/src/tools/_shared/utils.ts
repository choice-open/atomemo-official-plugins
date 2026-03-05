/**
 * Resolves the Airtable API token from the credential referenced by
 * args.parameters.airtable_credential. Returns null if not found.
 */
export function getAirtableToken(args: unknown): string | null {
  const a = args as {
    parameters?: Record<string, unknown>
    credentials?: Record<string, Record<string, unknown>>
  }
  if (!a?.credentials || !a?.parameters) return null
  const credKey = a.parameters["airtable_credential"]
  if (typeof credKey !== "string" || !credKey) return null
  const cred = a.credentials[credKey]
  const token = cred?.api_key
  return typeof token === "string" && token.trim() ? token.trim() : null
}

export function parseFieldsJson(raw: unknown): Record<string, unknown> {
  if (raw == null || raw === "") return {}
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>
  }
  if (typeof raw !== "string") {
    throw new Error("fields must be a string (JSON) or object")
  }
  const parsed = JSON.parse(raw)
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>
  }
  throw new Error("fields must be a valid JSON object")
}
