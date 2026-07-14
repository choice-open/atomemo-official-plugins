import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"

const BASE_URL = "https://api.tikhub.io"

type TikHubCredential = { api_key?: string }

export function replacePathParams(
  path: string,
  pathParams: Record<string, unknown>
): string {
  let finalPath = path
  const keys = [
    ...path.matchAll(/:([a-zA-Z0-9_]+)/g),
    ...path.matchAll(/\{([a-zA-Z0-9_]+)\}/g),
  ].map((item) => item[1])
  for (const key of keys) {
    const value = pathParams[key]
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Missing path parameter: ${key}`)
    }
    finalPath = finalPath
      .replaceAll(`:${key}`, encodeURIComponent(value))
      .replaceAll(`{${key}}`, encodeURIComponent(value))
  }
  return finalPath
}

function getApiKey(
  credentials: Record<string, unknown> | undefined,
  credentialId: string
): string {
  if (!credentials || !credentials[credentialId]) {
    throw new Error("Invalid credential_id. Please select a valid TikHub credential.")
  }
  const cred = credentials[credentialId] as TikHubCredential
  if (!cred.api_key || cred.api_key.trim() === "") {
    throw new Error("API Key is empty. Please configure the TikHub credential.")
  }
  return cred.api_key.trim()
}

export interface TikHubApiEndpoint {
  id: string
  method: "GET" | "POST"
  path: string
}

export interface TikHubRequestOptions {
  credentials: Record<string, unknown> | undefined
  credentialId: string
  pathParams?: Record<string, unknown>
  queryParams?: Record<string, string | undefined>
  body?: Record<string, unknown>
}

export async function invokeTikHubApi(
  endpoint: TikHubApiEndpoint,
  options: TikHubRequestOptions
): Promise<JsonValue> {
  const apiKey = getApiKey(options.credentials, options.credentialId)
  const path = replacePathParams(endpoint.path, options.pathParams ?? {})

  const url = new URL(path, BASE_URL)
  if (options.queryParams) {
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value)
      }
    }
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}` }
  if (endpoint.method === "POST") {
    headers["Content-Type"] = "application/json"
  }

  const fetchOptions: RequestInit = { method: endpoint.method, headers }
  if (endpoint.method === "POST" && options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  const response = await fetch(url.toString(), fetchOptions)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`TikHub API error ${response.status}: ${text}`)
  }
  return (await response.json()) as JsonValue
}

export function readRequiredStringParam(
  params: Record<string, unknown>,
  name: string
): string {
  const value = params[name]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required parameter: ${name}`)
  }
  return value.trim()
}
