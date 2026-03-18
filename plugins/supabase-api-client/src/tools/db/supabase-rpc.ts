import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseRpcTool = {
  name: "supabase-rpc",
  display_name: t("SUPABASE_RPC_DISPLAY_NAME"),
  description: t("SUPABASE_RPC_DESCRIPTION"),
  icon: "⚙️",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "function_name",
      type: "string",
      required: true,
      display_name: t("FUNCTION_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("FUNCTION_NAME_PLACEHOLDER"),
        hint: t("FUNCTION_NAME_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "args",
      type: "string",
      required: false,
      display_name: t("RPC_ARGS_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("RPC_ARGS_PLACEHOLDER"),
        hint: t("RPC_ARGS_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "schema",
      type: "string",
      required: false,
      display_name: t("SCHEMA_DISPLAY_NAME"),
      default: "public",
      ui: {
        component: "input",
        placeholder: t("SCHEMA_PLACEHOLDER"),
        hint: t("SCHEMA_HINT"),
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const functionName = String(parameters.function_name).trim()
    const schema = (parameters.schema as string)?.trim() || "public"
    const argsObj = parseJson<Record<string, unknown>>(
      parameters.args as string,
      {},
    )

    try {
      const { data, error } = await supabase
        .schema(schema)
        .rpc(
          functionName,
          Object.keys(argsObj).length > 0 ? argsObj : undefined,
        )

      if (error) {
        const e: any = new Error(error.message)
        e.code = error.code ?? null
        throw e
      }
      return {
        success: true,
        data,
        error: null,
        code: null,
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error(String(err))
    }
  },
} satisfies ToolDefinition
