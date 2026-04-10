import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import * as lark from "@larksuiteoapi/node-sdk"
import type { FeishuApiFunction } from "../feishu-api-functions"

type FeishuCredential = {
  app_id?: string
  app_secret?: string
}

export function replacePathParams(
  path: string,
  pathParams: Record<string, unknown>,
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

export function extractPathParamKeys(path: string): string[] {
  const keys = [
    ...path.matchAll(/:([a-zA-Z0-9_]+)/g),
    ...path.matchAll(/\{([a-zA-Z0-9_]+)\}/g),
  ].map((item) => item[1])
  return [...new Set(keys)]
}

function getCredential(
  credentials: Record<string, unknown> | undefined,
  credentialId: string,
): FeishuCredential {
  if (!credentials || !credentials[credentialId]) {
    throw new Error(
      "Invalid credential_id. Please select a valid Feishu credential.",
    )
  }
  return credentials[credentialId] as FeishuCredential
}

/** 可选 JSON 对象字符串；空字符串视为无 query/body */
export function parseOptionalJsonObject(
  raw: unknown,
  fieldName: string,
): Record<string, unknown> {
  if (typeof raw !== "string" || raw.trim() === "") {
    return {}
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object")
    }
    return parsed as Record<string, unknown>
  } catch {
    throw new Error(
      `Parameter \`${fieldName}\` must be a valid JSON object string.`,
    )
  }
}

export function readRequiredStringParam(
  parameters: Record<string, unknown>,
  key: string,
): string {
  const value = parameters[key]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Parameter \`${key}\` is required.`)
  }
  return value.trim()
}

export async function invokeFeishuOpenApi(
  fn: FeishuApiFunction,
  input: {
    credentials?: Record<string, unknown>
    credentialId: string
    pathParams: Record<string, string>
    queryParams?: Record<string, unknown>
    body?: Record<string, unknown>
  },
): Promise<JsonValue> {
  const credential = getCredential(input.credentials, input.credentialId)
  const appId =
    typeof credential.app_id === "string" ? credential.app_id.trim() : ""
  const appSecret =
    typeof credential.app_secret === "string"
      ? credential.app_secret.trim()
      : ""
  if (!appId || !appSecret) {
    throw new Error("Selected credential is missing app_id or app_secret.")
  }

  const client = new lark.Client({
    appId,
    appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
  })

  const requestPath = replacePathParams(fn.path, input.pathParams)
  const response = await client.request({
    method: fn.method,
    url: requestPath,
    params: (input.queryParams ?? {}) as Record<string, any>,
    data: (input.body ?? {}) as Record<string, any>,
  })

  return {
    function_id: fn.id,
    legacy_function_id: fn.legacy_id,
    function_name: fn.name,
    module: fn.module,
    method: fn.method,
    path: requestPath,
    response,
  } as JsonValue
}
