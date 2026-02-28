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

export const supabaseQueryTool = {
  name: "supabase-query",
  display_name: t("SUPABASE_QUERY_DISPLAY_NAME"),
  description: t("SUPABASE_QUERY_DESCRIPTION"),
  icon: "📋",
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
      name: "columns",
      type: "string",
      required: false,
      display_name: t("COLUMNS_DISPLAY_NAME"),
      default: "*",
      ui: {
        component: "input",
        placeholder: t("COLUMNS_PLACEHOLDER"),
        hint: t("COLUMNS_HINT"),
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
      name: "filters",
      type: "string",
      required: false,
      display_name: t("FILTERS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("FILTERS_PLACEHOLDER"),
        hint: t("FILTERS_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "order_by",
      type: "string",
      required: false,
      display_name: t("ORDER_BY_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("ORDER_BY_PLACEHOLDER"),
        hint: t("ORDER_BY_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "integer",
      required: false,
      display_name: t("LIMIT_DISPLAY_NAME"),
      default: 100,
      minimum: 1,
      maximum: 1000,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "offset",
      type: "integer",
      required: false,
      display_name: t("OFFSET_DISPLAY_NAME"),
      default: 0,
      minimum: 0,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "return_mode",
      type: "string",
      required: false,
      display_name: t("RETURN_MODE_DISPLAY_NAME"),
      default: "multiple",
      ui: {
        component: "select",
        options: [
          { value: "multiple", label: t("RETURN_MODE_MULTIPLE") },
          { value: "single", label: t("RETURN_MODE_SINGLE") },
          { value: "maybeSingle", label: t("RETURN_MODE_MAYBESINGLE") },
        ],
        hint: t("RETURN_MODE_HINT"),
        width: "medium",
      },
    },
    {
      name: "return_format",
      type: "string",
      required: false,
      display_name: t("RETURN_FORMAT_DISPLAY_NAME"),
      default: "json",
      ui: {
        component: "select",
        options: [
          { value: "json", label: t("RETURN_FORMAT_JSON") },
          { value: "csv", label: t("RETURN_FORMAT_CSV") },
        ],
        hint: t("RETURN_FORMAT_HINT"),
        width: "medium",
      },
    },
    {
      name: "explain",
      type: "boolean",
      required: false,
      display_name: t("EXPLAIN_DISPLAY_NAME"),
      default: false,
      ui: { component: "switch", hint: t("EXPLAIN_HINT") },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const cred = credentials?.["supabase_credential"]
    if (!cred?.supabase_url || !cred?.supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      }
    }

    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const table = String(parameters.table).trim()
    const columns = (parameters.columns as string)?.trim() || "*"
    const schema = (parameters.schema as string)?.trim() || "public"
    const filtersInput = parseJson<FiltersInput | null>(
      parameters.filters as string,
      null
    )
    const orderBy = (parameters.order_by as string)?.trim()
    const limit = Number(parameters.limit) || 100
    const offset = Number(parameters.offset) || 0
    const returnMode = (parameters.return_mode as string) || "multiple"
    const returnFormat = (parameters.return_format as string) || "json"
    const explain = Boolean(parameters.explain)

    try {
      let query = supabase.schema(schema).from(table).select(columns)
      query = applyFiltersAdvanced(query, filtersInput ?? undefined)
      if (orderBy) {
        const [col, dir] = orderBy.split(".")
        query = query.order(col, {
          ascending: dir?.toLowerCase() !== "desc",
        })
      }
      query = query.range(offset, offset + limit - 1)

      if (explain) {
        const explained = (query as unknown as { explain: (opts?: { format?: string }) => Promise<{ data: unknown; error: { message: string; code?: string } | null }> }).explain({ format: "json" })
        const { data, error } = await explained
        if (error) {
          return {
            success: false,
            error: error.message,
            code: error.code ?? null,
            data: null,
          }
        }
        return {
          success: true,
          data: { explain: data },
          error: null,
          code: null,
        } as any
      }

      if (returnFormat === "csv") {
        const csvChain = (query as unknown as { csv: () => Promise<{ data: string; error: { message: string; code?: string } | null }> }).csv()
        const { data, error } = await csvChain
        if (error) {
          return {
            success: false,
            error: error.message,
            code: error.code ?? null,
            data: null,
          }
        }
        return {
          success: true,
          data: data ?? "",
          error: null,
          code: null,
        } as any
      }

      if (returnMode === "single") {
        const singleChain = (query as unknown as { single: () => Promise<{ data: unknown; error: { message: string; code?: string } | null }> }).single()
        const { data, error } = await singleChain
        if (error) {
          return {
            success: false,
            error: error.message,
            code: error.code ?? null,
            data: null,
          }
        }
        return {
          success: true,
          data,
          error: null,
          code: null,
        } as any
      }

      if (returnMode === "maybeSingle") {
        const maybeChain = (query as unknown as { maybeSingle: () => Promise<{ data: unknown; error: { message: string; code?: string } | null }> }).maybeSingle()
        const { data, error } = await maybeChain
        if (error) {
          return {
            success: false,
            error: error.message,
            code: error.code ?? null,
            data: null,
          }
        }
        return {
          success: true,
          data,
          error: null,
          code: null,
        } as any
      }

      const { data, error } = await query

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code ?? null,
          data: null,
        }
      }
      return {
        success: true,
        data,
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
