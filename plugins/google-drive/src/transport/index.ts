/**
 * Google Drive API transport layer (aligned with n8n Drive v2 pattern).
 * Single entry point for all Drive API requests: method + resource + body/qs/options.
 */

const GOOGLE_APIS_BASE = "https://www.googleapis.com"

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

export type GoogleDriveRequestOptions = {
  body?: string | Uint8Array | Record<string, unknown>
  qs?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

/**
 * Build query string from qs, skipping undefined values.
 */
function buildQueryString(qs: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(qs)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const s = params.toString()
  return s ? `?${s}` : ""
}

/**
 * Execute a request against the Google APIs (Drive). Uses resource path + optional
 * query string and optional body/headers, like n8n's googleApiRequest.
 */
export async function googleDriveRequest(
  accessToken: string,
  method: HttpMethod,
  resource: string,
  options: GoogleDriveRequestOptions = {},
): Promise<Response> {
  const { body, qs = {}, headers: customHeaders = {} } = options

  const url =
    GOOGLE_APIS_BASE + resource + (Object.keys(qs).length ? buildQueryString(qs) : "")

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    ...customHeaders,
  }

  // Default JSON content-type only when body is an object (and not binary)
  if (body !== undefined && typeof body === "object" && !(body instanceof Uint8Array)) {
    if (!("Content-Type" in headers)) {
      headers["Content-Type"] = "application/json"
    }
  }

  const fetchBody =
    body === undefined
      ? undefined
      : typeof body === "string"
        ? body
        : body instanceof Uint8Array
          ? body
          : JSON.stringify(body)

  const proxy = process.env.HUB_HTTP_PROXY || undefined

  return fetch(url, {
    method,
    headers,
    body: fetchBody,
    proxy,
  })
}
