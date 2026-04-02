type GaxiosLike = Error & {
  code?: number | string
  errors?: Array<{ message?: string; reason?: string }>
  response?: { status?: number; statusText?: string; data?: unknown }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null
}

/** Normalizes @googleapis/sheets / gaxios failures into a single Error message. */
export function toSheetsApiError(err: unknown): Error {
  if (!(err instanceof Error)) {
    return new Error(String(err))
  }

  const e = err as GaxiosLike
  const parts: string[] = []

  if (e.message) parts.push(e.message)

  const firstApi = e.errors?.[0]
  if (firstApi?.message && firstApi.message !== e.message) {
    parts.push(firstApi.message)
  }
  if (firstApi?.reason && firstApi.reason !== firstApi.message) {
    parts.push(`reason=${firstApi.reason}`)
  }

  if (typeof e.code === "number" || typeof e.code === "string") {
    parts.push(`code=${e.code}`)
  }
  if (e.response?.status !== undefined) {
    parts.push(`status=${e.response.status}`)
  }

  const data = e.response?.data
  if (isRecord(data)) {
    const apiErr = data.error
    if (typeof apiErr === "string" && !parts.some((p) => p.includes(apiErr))) {
      parts.push(apiErr)
    } else if (isRecord(apiErr) && typeof apiErr.message === "string") {
      const m = apiErr.message
      if (!parts.some((p) => p.includes(m))) {
        parts.push(m)
      }
    }
  }

  const text = parts.filter(Boolean).join(" | ")
  return new Error(text || "Google Sheets API request failed")
}

export async function callSheets<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    throw toSheetsApiError(e)
  }
}
