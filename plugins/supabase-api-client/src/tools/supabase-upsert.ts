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

export const supabaseUpsertTool = {
  name: "supabase-upsert",
  display_name: t("SUPABASE_UPSERT_DISPLAY_NAME"),
  description: t("SUPABASE_UPSERT_DESCRIPTION"),
  icon: "🔄",
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
        placeholder: t("ROWS_UPSERT_PLACEHOLDER"),
        hint: t("ROWS_UPSERT_HINT"),
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
      name: "on_conflict",
      type: "string",
      required: false,
      display_name: t("ON_CONFLICT_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("ON_CONFLICT_PLACEHOLDER"),
        hint: t("ON_CONFLICT_HINT"),
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
      }
    }

    const supabase = createSupabaseClient(supabase_url, supabase_key)
    const table = String(parameters.table).trim()
    const schema = (parameters.schema as string)?.trim() || "public"
    const returning =
      (parameters.returning as "minimal" | "representation") || "minimal"
    const onConflict = (parameters.on_conflict as string)?.trim()
    const rowsRaw = parseJson<unknown>(parameters.rows as string, null)

    if (rowsRaw == null) {
      return {
        success: false,
        error: "Parameter 'rows' must be a valid JSON array or object.",
        data: null,
        code: null,
      }
    }

    const rows = Array.isArray(rowsRaw) ? rowsRaw : [rowsRaw]
    const options: { onConflict?: string } = {}
    if (onConflict) options.onConflict = onConflict

    try {
      const base = supabase.schema(schema).from(table).upsert(rows, options)
      type Result = { data: unknown; error: { message: string; code?: string } | null }
      const { data, error } =
        returning === "representation"
          ? await (base as unknown as { select: () => Promise<Result> }).select()
          : await (base as unknown as Promise<Result>)

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code ?? null,
          data: null,
        }
      }
      const resultData: unknown = data ?? null
      return {
        success: true,
        data: resultData,
        error: null,
        code: null,
      } as any
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
