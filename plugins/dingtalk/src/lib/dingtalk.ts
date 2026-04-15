import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { hubFetch } from "./fetch"

const API_BASE_URL = "https://api.dingtalk.com/v1.0"
const ACCESS_TOKEN_URL = `${API_BASE_URL}/oauth2/accessToken`
export const DINGTALK_APP_CREDENTIAL_NAME = "dingtalk-app"

export type DingtalkAppCredential = {
  corp_id?: string
  client_id?: string
  client_secret?: string
  user_union_id?: string
}

type DingtalkRequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path?: string
  url?: string
  query?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
}

type TokenCacheEntry = {
  accessToken: string
  expiresAt: number
}

const tokenCache = new Map<string, TokenCacheEntry>()

function credentialCacheKey(credential: DingtalkAppCredential): string {
  return JSON.stringify([
    credential.corp_id ?? "",
    credential.client_id ?? "",
    credential.client_secret ?? "",
  ])
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function ensureClientCredentials(credential: DingtalkAppCredential) {
  const clientId = asNonEmptyString(credential.client_id)
  const clientSecret = asNonEmptyString(credential.client_secret)

  if (!clientId || !clientSecret) {
    throw new Error(
      "DingTalk credential is missing client_id or client_secret. Please select a valid credential.",
    )
  }

  return { clientId, clientSecret }
}

function buildUrl(
  urlOrPath: string,
  query: Record<string, unknown> = {},
): string {
  const url = new URL(
    /^https?:\/\//i.test(urlOrPath) ? urlOrPath : `${API_BASE_URL}${urlOrPath}`,
  )

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== "") {
          url.searchParams.append(key, String(item))
        }
      }
      continue
    }
    url.searchParams.set(key, String(value))
  }

  return url.toString()
}

function isLegacyUrl(url: string): boolean {
  return url.includes("oapi.dingtalk.com")
}

function looksLikeTokenProblem(payload: unknown): boolean {
  if (payload === undefined || payload === null) return false

  let serialized = ""
  if (typeof payload === "string") {
    serialized = payload
  } else {
    try {
      serialized = JSON.stringify(payload)
    } catch {
      return false
    }
  }

  const value = serialized.toLowerCase()
  return (
    (value.includes("access_token") &&
      (value.includes("blank") ||
        value.includes("invalid") ||
        value.includes("expired") ||
        value.includes("非法") ||
        value.includes("不合法"))) ||
    value.includes("应用尚未开通所需的权限")
  )
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}))
  }

  const text = await response.text().catch(() => "")
  if (!text.trim()) return {}

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function buildErrorMessage(response: Response, payload: unknown): string {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>
    const message =
      asNonEmptyString(obj.message) ??
      asNonEmptyString(obj.errmsg) ??
      asNonEmptyString(obj.errorMsg) ??
      asNonEmptyString(obj.error_message) ??
      asNonEmptyString(obj.error)

    const code =
      asNonEmptyString(obj.code) ??
      asNonEmptyString(obj.errcode) ??
      asNonEmptyString(obj.requestid)

    if (message && code) return `${message} (${code})`
    if (message) return message
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim()
  }

  return `DingTalk API error: ${response.status} ${response.statusText}`
}

async function fetchAccessToken(
  credential: DingtalkAppCredential,
): Promise<TokenCacheEntry> {
  const { clientId, clientSecret } = ensureClientCredentials(credential)

  const response = await hubFetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      appKey: clientId,
      appSecret: clientSecret,
    }),
  })

  const payload = (await parseResponse(response)) as Record<string, unknown>

  if (!response.ok) {
    throw new Error(buildErrorMessage(response, payload))
  }

  const accessToken =
    asNonEmptyString(payload.accessToken) ??
    asNonEmptyString(payload.access_token)
  const expiresInRaw = payload.expireIn ?? payload.expiresIn ?? payload.expires_in
  const expiresIn =
    typeof expiresInRaw === "number"
      ? expiresInRaw
      : Number(String(expiresInRaw ?? "7200"))

  if (!accessToken) {
    throw new Error("DingTalk access token response did not include accessToken.")
  }

  return {
    accessToken,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
  }
}

export async function getAccessToken(
  credential: DingtalkAppCredential,
  options: { forceRefresh?: boolean } = {},
): Promise<string> {
  const cacheKey = credentialCacheKey(credential)
  const cached = tokenCache.get(cacheKey)

  if (!options.forceRefresh && cached && cached.expiresAt > Date.now()) {
    return cached.accessToken
  }

  const next = await fetchAccessToken(credential)
  tokenCache.set(cacheKey, next)
  return next.accessToken
}

async function sendRequest(
  credential: DingtalkAppCredential,
  options: DingtalkRequestOptions,
  requestOptions: { forceRefresh?: boolean } = {},
) {
  const baseQuery = { ...(options.query ?? {}) }
  const urlOrPath = options.url ?? options.path
  if (!urlOrPath) throw new Error("DingTalk request is missing path or url.")

  const accessToken = await getAccessToken(credential, {
    forceRefresh: requestOptions.forceRefresh,
  })

  const url = buildUrl(urlOrPath, baseQuery)
  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  }

  if (isLegacyUrl(url)) {
    const withToken = new URL(url)
    withToken.searchParams.set("access_token", accessToken)
    return hubFetch(withToken.toString(), {
      method: options.method,
      headers: {
        ...headers,
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body:
        options.body === undefined
          ? undefined
          : typeof options.body === "string"
            ? options.body
            : JSON.stringify(options.body),
    })
  }

  return hubFetch(url, {
    method: options.method,
    headers: {
      ...headers,
      "x-acs-dingtalk-access-token": accessToken,
      ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
  })
}

export async function dingtalkRequest<T = JsonValue>(
  credential: DingtalkAppCredential,
  options: DingtalkRequestOptions,
): Promise<T> {
  const first = await sendRequest(credential, options)
  const firstPayload = await parseResponse(first)

  if (first.ok && !looksLikeTokenProblem(firstPayload)) {
    return firstPayload as T
  }

  if (looksLikeTokenProblem(firstPayload)) {
    const retry = await sendRequest(credential, options, { forceRefresh: true })
    const retryPayload = await parseResponse(retry)

    if (!retry.ok) {
      throw new Error(buildErrorMessage(retry, retryPayload))
    }

    return retryPayload as T
  }

  throw new Error(buildErrorMessage(first, firstPayload))
}

export async function downloadBinary(url: string): Promise<{
  content: string
  mimeType: string
  filename: string
  size: number
}> {
  const response = await hubFetch(url, { method: "GET" })
  if (!response.ok) {
    const payload = await parseResponse(response)
    throw new Error(buildErrorMessage(response, payload))
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  const mimeType =
    response.headers.get("content-type")?.split(";")[0]?.trim() ??
    "application/octet-stream"
  const filename =
    response.headers
      .get("content-disposition")
      ?.match(/filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/)?.[1] ??
    response.headers
      .get("content-disposition")
      ?.match(/filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/)?.[2] ??
    "download.bin"

  return {
    content: Buffer.from(bytes).toString("base64"),
    mimeType,
    filename: decodeURIComponent(filename),
    size: bytes.length,
  }
}

export async function uploadBinary(
  url: string,
  body: Uint8Array | Buffer,
  mimeType: string,
) {
  const response = await hubFetch(url, {
    method: "PUT",
    headers: {
      "content-type": mimeType || "application/octet-stream",
    },
    body,
  })

  if (!response.ok) {
    const payload = await parseResponse(response)
    throw new Error(buildErrorMessage(response, payload))
  }
}

export function resolveCredential(
  args: {
    parameters?: Record<string, unknown>
    credentials?: Record<string, Record<string, unknown>>
  },
  fieldName = "credential_id",
): DingtalkAppCredential {
  const credentialId = asNonEmptyString(args.parameters?.[fieldName])
  if (!credentialId) {
    throw new Error("Please select a DingTalk credential.")
  }

  const credential = args.credentials?.[credentialId]
  if (!credential) {
    throw new Error("Selected DingTalk credential was not found.")
  }

  return credential as DingtalkAppCredential
}

export function resolveOperatorId(
  parameters: Record<string, unknown>,
  credential: DingtalkAppCredential,
): string {
  const operatorId =
    asNonEmptyString(parameters.operator_id) ??
    asNonEmptyString(credential.user_union_id)

  if (!operatorId) {
    throw new Error(
      "This operation requires an operator unionId. Set operator_id on the tool or user_union_id on the credential.",
    )
  }

  return operatorId
}

export function parseJsonParameter<T>(
  value: unknown,
  label: string,
  fallback?: T,
): T {
  if (value === undefined || value === null || value === "") {
    if (fallback !== undefined) return fallback
    throw new Error(`${label} is required.`)
  }

  if (typeof value === "object") return value as T
  if (typeof value !== "string") {
    throw new Error(`${label} must be a JSON string or object.`)
  }

  try {
    return JSON.parse(value) as T
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`${label} must be valid JSON. ${message}`)
  }
}

export function guessExtension(filename: string, mimeType: string): string | null {
  const lastDot = filename.lastIndexOf(".")
  if (lastDot > -1 && lastDot < filename.length - 1) {
    return filename.slice(lastDot)
  }

  const known: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
  }

  return known[mimeType] ?? null
}

export function resetTokenCacheForTests() {
  tokenCache.clear()
}
