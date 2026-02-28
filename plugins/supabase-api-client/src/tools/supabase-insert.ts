import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseInsertTool = {
  name: "supabase-insert",
  display_name: t("SUPABASE_INSERT_DISPLAY_NAME"),
  description: t("SUPABASE_INSERT_DESCRIPTION"),
  icon: "➕",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "table",
      type: "string",
      required: true,
      display_name: t("TABLE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("TABLE_PLACEHOLDER"),
        hint: t("TABLE_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "rows",
      type: "string",
      required: true,
      display_name: t("ROWS_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("ROWS_INSERT_PLACEHOLDER"),
        hint: t("ROWS_INSERT_HINT"),
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
    {
      name: "returning",
      type: "string",
      required: false,
      default: "minimal",
      enum: ["minimal", "representation"],
      display_name: t("RETURNING_DISPLAY_NAME"),
      ui: { component: "select", width: "medium" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credentialId = parameters?.["supabase_credential"]
    const { supabase_url, supabase_key } = credentials?.[credentialId] ?? {}
    if (!supabase_url || !supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
        count: null,
      }
    }

    const supabase = createSupabaseClient(supabase_url, supabase_key)
    const table = String(parameters.table).trim()
    const schema = (parameters.schema as string)?.trim() || "public"
    const returning =
      (parameters.returning as "minimal" | "representation") || "minimal"
    const rowsRaw = parseJson<unknown>(parameters.rows as string, null)

    if (rowsRaw == null) {
      return {
        success: false,
        error: "Parameter 'rows' must be a valid JSON array or object.",
        data: null,
        code: null,
        count: null,
      }
    }

    const rows = Array.isArray(rowsRaw) ? rowsRaw : [rowsRaw]

    try {
      const options = { count: "exact" as const }
      const base = supabase.schema(schema).from(table).insert(rows, options)

      const { data, error, count } =
        returning === "representation"
          ? await base.select()
          : await base

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code ?? null,
          data: null,
          count: null,
        }
      }
      return {
        success: true,
        data: data ?? null,
        count: count ?? rows.length,
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
        count: null,
      }
    }
  },
} satisfies ToolDefinition
