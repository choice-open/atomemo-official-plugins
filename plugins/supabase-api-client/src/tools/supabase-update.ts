import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import {
  applyFiltersAdvanced,
  type FiltersInput,
} from "../lib/supabase-filters"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

function hasFilters(f: FiltersInput | null | undefined): boolean {
  if (f == null) return false
  if (Array.isArray(f)) return f.length > 0
  return Object.keys(f).length > 0
}

export const supabaseUpdateTool = {
  name: "supabase-update",
  display_name: t("SUPABASE_UPDATE_DISPLAY_NAME"),
  description: t("SUPABASE_UPDATE_DESCRIPTION"),
  icon: "✏️",
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
      name: "values",
      type: "string",
      required: true,
      display_name: t("VALUES_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("VALUES_UPDATE_PLACEHOLDER"),
        hint: t("VALUES_UPDATE_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "filters",
      type: "string",
      required: true,
      display_name: t("FILTERS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("FILTERS_PLACEHOLDER"),
        hint: t("FILTERS_UPDATE_HINT"),
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
      }
    }

    const supabase = createSupabaseClient(supabase_url, supabase_key)
    const table = String(parameters.table).trim()
    const schema = (parameters.schema as string)?.trim() || "public"
    const returning =
      (parameters.returning as "minimal" | "representation") || "minimal"
    const values = parseJson<Record<string, unknown>>(
      parameters.values as string,
      {}
    )
    const filtersInput = parseJson<FiltersInput | null>(
      parameters.filters as string,
      null
    )

    if (Object.keys(values).length === 0) {
      return {
        success: false,
        error: "Parameter 'values' must be a non-empty JSON object.",
        data: null,
        code: null,
      }
    }
    if (!hasFilters(filtersInput)) {
      return {
        success: false,
        error:
          'Parameter "filters" is required to target rows (e.g. {"id": 1} or array of conditions).',
        data: null,
        code: null,
      }
    }

    try {
      const base = supabase.schema(schema).from(table).update(values)
      const filtered = applyFiltersAdvanced(base, filtersInput ?? undefined)

      type Result = { data: unknown; error: { message: string; code?: string } | null }
      const { data, error } =
        returning === "representation"
          ? await (filtered as unknown as { select: () => Promise<Result> }).select()
          : await (filtered as unknown as Promise<Result>)

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
