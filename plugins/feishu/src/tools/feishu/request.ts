import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types";
import * as lark from "@larksuiteoapi/node-sdk";
import type { FeishuApiFunction } from "../feishu-api-functions";

type FeishuCredential = {
  app_id?: string;
  app_secret?: string;
};

export function replacePathParams(
  path: string,
  pathParams: Record<string, unknown>,
): string {
  let finalPath = path;
  const keys = [
    ...path.matchAll(/:([a-zA-Z0-9_]+)/g),
    ...path.matchAll(/\{([a-zA-Z0-9_]+)\}/g),
  ].map((item) => item[1]);
  for (const key of keys) {
    const value = pathParams[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Missing path parameter: ${key}`);
    }
    finalPath = finalPath
      .replaceAll(`:${key}`, encodeURIComponent(value))
      .replaceAll(`{${key}}`, encodeURIComponent(value));
  }
  return finalPath;
}

export function extractPathParamKeys(path: string): string[] {
  const keys = [
    ...path.matchAll(/:([a-zA-Z0-9_]+)/g),
    ...path.matchAll(/\{([a-zA-Z0-9_]+)\}/g),
  ].map((item) => item[1]);
  return [...new Set(keys)];
}

function getCredential(
  credentials: Record<string, unknown> | undefined,
  credentialId: string,
): FeishuCredential {
  if (!credentials || !credentials[credentialId]) {
    throw new Error(
      "Invalid credential_id. Please select a valid Feishu credential.",
    );
  }
  return credentials[credentialId] as FeishuCredential;
}

/** 使用应用凭据创建 Lark 客户端（用于需 multipart / 流式响应等非 JSON `request` 的接口）。 */
export function createFeishuLarkClient(
  credentials: Record<string, unknown> | undefined,
  credentialId: string,
): InstanceType<typeof lark.Client> {
  const credential = getCredential(credentials, credentialId);
  const appId =
    typeof credential.app_id === "string" ? credential.app_id.trim() : "";
  const appSecret =
    typeof credential.app_secret === "string"
      ? credential.app_secret.trim()
      : "";
  if (!appId || !appSecret) {
    throw new Error("Selected credential is missing app_id or app_secret.");
  }

  return new lark.Client({
    appId,
    appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
    disableTokenCache: false,
    // loggerLevel: 5,
  });
}

/** 可选 JSON 对象字符串；空字符串视为无 query/body */
export function parseOptionalJsonObject(
  raw: unknown,
  fieldName: string,
): Record<string, unknown> {
  if (typeof raw !== "string" || raw.trim() === "") {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new Error(
      `Parameter \`${fieldName}\` must be a valid JSON object string.`,
    );
  }
}

export function readRequiredStringParam(
  parameters: Record<string, unknown>,
  key: string,
): string {
  const value = parameters[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Parameter \`${key}\` is required.`);
  }
  return value.trim();
}

/** 自 SDK / axios 抛出的错误中提取 HTTP 响应（若有） */
function extractHttpResponse(e: unknown): {
  status: number;
  statusText: string;
  data: unknown;
} | null {
  if (!e || typeof e !== "object") return null;
  const response = (e as { response?: unknown }).response;
  if (!response || typeof response !== "object") return null;
  const r = response as {
    status?: number;
    statusText?: string;
    data?: unknown;
  };
  if (typeof r.status !== "number") return null;
  return {
    status: r.status,
    statusText: typeof r.statusText === "string" ? r.statusText : "",
    data: r.data,
  };
}

function errorMessageFromUnknown(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export async function invokeFeishuOpenApi(
  fn: FeishuApiFunction,
  input: {
    credentials?: Record<string, unknown>;
    credentialId: string;
    pathParams: Record<string, string>;
    queryParams?: Record<string, unknown>;
    body?: Record<string, unknown>;
  },
): Promise<JsonValue> {
  const credential = getCredential(input.credentials, input.credentialId);
  const appId =
    typeof credential.app_id === "string" ? credential.app_id.trim() : "";
  const appSecret =
    typeof credential.app_secret === "string"
      ? credential.app_secret.trim()
      : "";
  if (!appId || !appSecret) {
    throw new Error("Selected credential is missing app_id or app_secret.");
  }

  const client = new lark.Client({
    appId,
    appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
    disableTokenCache: false,
    // loggerLevel: 5,
  });

  const requestPath = replacePathParams(fn.path, input.pathParams);

  try {
    const response = await client.request({
      method: fn.method,
      url: requestPath,
      params: (input.queryParams ?? {}) as Record<string, any>,
      data: (input.body ?? {}) as Record<string, any>,
    });

    return response;
  } catch (e: unknown) {
    const http = extractHttpResponse(e);
    if (http) {
      const data =
        typeof http.data === "string"
          ? tryParseJsonString(http.data)
          : http.data;
      const err = {
        function_id: fn.id,
        function_name: fn.name,
        module: fn.module,
        method: fn.method,
        path: requestPath,
        req: input,
        http_error: true,
        response: {
          status: http.status,
          statusText: http.statusText,
          data,
        },
      };
      throw Error(JSON.stringify(err));
    }
    throw new Error(errorMessageFromUnknown(e));
  }
}

/** 若飞书/网关返回 text/json 字符串，解析为对象便于展示与下游使用 */
function tryParseJsonString(raw: string): unknown {
  const t = raw.trim();
  if (!t.startsWith("{") && !t.startsWith("[")) return raw;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}
