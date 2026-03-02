import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseInvokeEdgeFunctionTool: ToolDefinition = {
  name: "supabase-invoke-edge-function",
  display_name: t("SUPABASE_INVOKE_EDGE_FUNCTION_DISPLAY_NAME"),
  description: t("SUPABASE_INVOKE_EDGE_FUNCTION_DESCRIPTION"),
  icon: "⚡",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "use_service_role_key",
      type: "boolean",
      required: false,
      display_name: t("EDGE_FUNCTION_USE_SERVICE_ROLE_KEY_DISPLAY_NAME"),
      default: true,
      ui: {
        component: "switch",
        hint: t("EDGE_FUNCTION_USE_SERVICE_ROLE_KEY_HINT"),
        width: "medium",
      },
    },
    {
      name: "function_name",
      type: "string",
      required: true,
      display_name: t("EDGE_FUNCTION_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("EDGE_FUNCTION_NAME_PLACEHOLDER"),
        hint: t("EDGE_FUNCTION_NAME_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "body",
      type: "string",
      required: false,
      display_name: t("EDGE_FUNCTION_BODY_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("EDGE_FUNCTION_BODY_PLACEHOLDER"),
        hint: t("EDGE_FUNCTION_BODY_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "method",
      type: "string",
      required: false,
      default: "POST",
      display_name: t("EDGE_FUNCTION_METHOD_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "POST", label: t("EDGE_FUNCTION_METHOD_POST") },
          { value: "GET", label: t("EDGE_FUNCTION_METHOD_GET") },
          { value: "PUT", label: t("EDGE_FUNCTION_METHOD_PUT") },
          { value: "PATCH", label: t("EDGE_FUNCTION_METHOD_PATCH") },
          { value: "DELETE", label: t("EDGE_FUNCTION_METHOD_DELETE") },
        ],
        hint: t("EDGE_FUNCTION_METHOD_HINT"),
        width: "medium",
      },
    },
    {
      name: "headers",
      type: "string",
      required: false,
      display_name: t("EDGE_FUNCTION_HEADERS_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("EDGE_FUNCTION_HEADERS_PLACEHOLDER"),
        hint: t("EDGE_FUNCTION_HEADERS_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const useServiceRoleKey = parameters.use_service_role_key !== false
    const clientResult = getSupabaseClientFromArgs(parameters, credentials, "supabase_credential", {
      useServiceRoleKey,
    })
    if (clientResult.error) return clientResult.error

    const supabase = clientResult.supabase
    const functionName = String(parameters.function_name).trim()
    if (!functionName) {
      return {
        success: false,
        error: "function_name is required.",
        data: null,
        code: null,
      }
    }

    const bodyRaw = (parameters.body as string)?.trim()
    const body = bodyRaw
      ? parseJson<Record<string, unknown>>(bodyRaw, {})
      : undefined
    const method = (
      (parameters.method as string)?.trim() || "POST"
    ).toUpperCase() as "POST" | "GET" | "PUT" | "PATCH" | "DELETE"
    const headersRaw = (parameters.headers as string)?.trim()
    const headers = headersRaw
      ? (parseJson<Record<string, string>>(headersRaw, {}) as
          | Record<string, string>
          | undefined)
      : undefined

    try {
      type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
      const options: {
        body?: Record<string, unknown>
        method?: HttpMethod
        headers?: Record<string, string>
      } = {}
      if (body !== undefined && Object.keys(body).length > 0)
        options.body = body
      if (method && method !== "POST") options.method = method as HttpMethod
      if (headers !== undefined && Object.keys(headers).length > 0)
        options.headers = headers

      const { data, error } = await supabase.functions.invoke(
        functionName,
        options,
      )

      if (error) {
        const isNon2xx =
          error.message?.includes("non-2xx") ?? false
        if (isNon2xx) {
          return {
            success: true,
            data: { non2xx: true, error: error.message },
            error: null,
            code: null,
          }
        }
        return {
          success: false,
          error: error.message,
          code: (error as { code?: string }).code ?? null,
          data: null,
        }
      }
      return {
        success: true,
        data,
        error: null,
        code: null,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: message,
        data: null,
        code: null,
      }
    }
  },
} satisfies ToolDefinition
