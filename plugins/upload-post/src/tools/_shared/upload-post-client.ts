type UnknownRecord = Record<string, unknown>

export const SUPPORTED_PLATFORMS = [
  "tiktok",
  "instagram",
  "youtube",
  "facebook",
  "linkedin",
  "x",
  "threads",
  "pinterest",
  "reddit",
  "bluesky",
] as const

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number]

export const PHOTO_SUPPORTED_PLATFORMS = SUPPORTED_PLATFORMS.filter(
  (platform) => platform !== "youtube",
) as readonly Exclude<SupportedPlatform, "youtube">[]

const DEFAULT_BASE_URL = "https://api.upload-post.com/api"

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {}
}

export function getArgs(argsInput: unknown): {
  parameters: UnknownRecord
  credentials: UnknownRecord
} {
  const args = asRecord(argsInput)
  return {
    parameters: asRecord(args.parameters),
    credentials: asRecord(args.credentials),
  }
}

export function getUploadPostApiKey(argsInput: unknown): string | null {
  const { parameters, credentials } = getArgs(argsInput)
  const credentialId = parameters.credentialId

  if (typeof credentialId !== "string" || credentialId.trim() === "") {
    return null
  }

  const credential = asRecord(credentials[credentialId])
  const apiKey = credential.api_key

  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return null
  }

  return apiKey
}

export function getApiBaseUrl(): string {
  const baseUrl = process.env.UPLOAD_POST_API_BASE_URL
  if (typeof baseUrl === "string" && baseUrl.trim() !== "") {
    const normalized = baseUrl.replace(/\/$/, "")
    if (
      normalized.includes("api.upload-post.com") &&
      !normalized.endsWith("/api")
    ) {
      return `${normalized}/api`
    }

    return normalized
  }

  return DEFAULT_BASE_URL
}

export function parsePlatforms(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter(Boolean)
}

export function validatePlatforms(platforms: string[]): string[] {
  const unsupported = platforms.filter(
    (platform) => !SUPPORTED_PLATFORMS.includes(platform as SupportedPlatform),
  )

  return [...new Set(unsupported)]
}

export function parseApiResponseBody(bodyText: string): unknown {
  if (!bodyText.trim()) {
    return null
  }

  try {
    return JSON.parse(bodyText)
  } catch {
    return bodyText
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error ?? "Unknown error")
}

function extractApiErrorReason(status: number, body: unknown): string {
  if (typeof body === "string" && body.trim() !== "") {
    return body
  }

  if (body && typeof body === "object" && !Array.isArray(body)) {
    const record = body as Record<string, unknown>

    if (typeof record.message === "string" && record.message.trim() !== "") {
      return record.message
    }

    if (typeof record.error === "string" && record.error.trim() !== "") {
      return record.error
    }

    if (typeof record.detail === "string" && record.detail.trim() !== "") {
      return record.detail
    }
  }

  return `HTTP ${status}`
}

export type UploadPostResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: string }

function alternateApiBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/api") ? baseUrl.replace(/\/api$/, "") : `${baseUrl}/api`
}

async function safeReadResponseBody(response: Response): Promise<unknown> {
  const rawBody = await response.text()
  return parseApiResponseBody(rawBody)
}

export async function postJson<T>(
  path: string,
  apiKey: string,
  payload: UnknownRecord,
): Promise<UploadPostResult<T>> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Apikey ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const parsedBody = await safeReadResponseBody(response)
    let errorStatus = response.status
    let errorBody = parsedBody

    if (response.status === 404) {
      const fallbackUrl = `${alternateApiBaseUrl(baseUrl)}${path}`
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Apikey ${apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      const fallbackParsedBody = await safeReadResponseBody(fallbackResponse)
      if (fallbackResponse.ok) {
        return {
          ok: true,
          data: fallbackParsedBody as T,
        }
      }

      errorStatus = fallbackResponse.status
      errorBody = fallbackParsedBody
    }

    if (!response.ok) {
      return {
        ok: false,
        reason: extractApiErrorReason(errorStatus, errorBody),
      }
    }

    return {
      ok: true,
      data: parsedBody as T,
    }
  } catch (error) {
    return {
      ok: false,
      reason: `Network error: ${getErrorMessage(error)}`,
    }
  }
}

export async function postForm<T>(
  path: string,
  apiKey: string,
  formData: FormData,
): Promise<UploadPostResult<T>> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Apikey ${apiKey}`,
      },
      body: formData,
    })

    const parsedBody = await safeReadResponseBody(response)
    let errorStatus = response.status
    let errorBody = parsedBody

    if (response.status === 404) {
      const fallbackUrl = `${alternateApiBaseUrl(baseUrl)}${path}`
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: {
          authorization: `Apikey ${apiKey}`,
        },
        body: formData,
      })

      const fallbackParsedBody = await safeReadResponseBody(fallbackResponse)
      if (fallbackResponse.ok) {
        return {
          ok: true,
          data: fallbackParsedBody as T,
        }
      }

      errorStatus = fallbackResponse.status
      errorBody = fallbackParsedBody
    }

    if (!response.ok) {
      return {
        ok: false,
        reason: extractApiErrorReason(errorStatus, errorBody),
      }
    }

    return {
      ok: true,
      data: parsedBody as T,
    }
  } catch (error) {
    return {
      ok: false,
      reason: `Network error: ${getErrorMessage(error)}`,
    }
  }
}

export async function getJson<T>(
  path: string,
  apiKey: string,
): Promise<UploadPostResult<T>> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Apikey ${apiKey}`,
      },
    })

    const parsedBody = await safeReadResponseBody(response)
    let errorStatus = response.status
    let errorBody = parsedBody

    if (response.status === 404) {
      const fallbackUrl = `${alternateApiBaseUrl(baseUrl)}${path}`
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "GET",
        headers: {
          authorization: `Apikey ${apiKey}`,
        },
      })

      const fallbackParsedBody = await safeReadResponseBody(fallbackResponse)
      if (fallbackResponse.ok) {
        return {
          ok: true,
          data: fallbackParsedBody as T,
        }
      }

      errorStatus = fallbackResponse.status
      errorBody = fallbackParsedBody
    }

    if (!response.ok) {
      return {
        ok: false,
        reason: extractApiErrorReason(errorStatus, errorBody),
      }
    }

    return {
      ok: true,
      data: parsedBody as T,
    }
  } catch (error) {
    return {
      ok: false,
      reason: `Network error: ${getErrorMessage(error)}`,
    }
  }
}
