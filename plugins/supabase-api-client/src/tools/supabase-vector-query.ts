import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"
import { t } from "../i18n/i18n-node"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || String(input).trim() === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseVectorQueryTool = {
  name: "supabase-vector-query",
  display_name: t("VECTOR_QUERY_DISPLAY_NAME"),
  description: t("VECTOR_QUERY_DESCRIPTION"),
  icon: "📐",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "vector_bucket_name",
      type: "string",
      required: true,
      display_name: t("VECTOR_BUCKET_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_BUCKET_NAME_PLACEHOLDER"),
        hint: t("VECTOR_BUCKET_NAME_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "index_name",
      type: "string",
      required: true,
      display_name: t("VECTOR_INDEX_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_INDEX_NAME_PLACEHOLDER"),
        hint: t("VECTOR_INDEX_NAME_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "query_vector",
      type: "string",
      required: true,
      display_name: t("VECTOR_QUERY_VECTOR_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_QUERY_VECTOR_PLACEHOLDER"),
        hint: t("VECTOR_QUERY_VECTOR_HINT"),
        width: "full",
      },
    },
    {
      name: "top_k",
      type: "integer",
      required: false,
      display_name: t("VECTOR_TOP_K_DISPLAY_NAME"),
      default: 10,
      minimum: 1,
      maximum: 1000,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "filter",
      type: "string",
      required: false,
      display_name: t("VECTOR_FILTER_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_FILTER_PLACEHOLDER"),
        hint: t("VECTOR_FILTER_HINT"),
        width: "medium",
      },
    },
    {
      name: "return_distance",
      type: "boolean",
      required: false,
      display_name: t("VECTOR_RETURN_DISTANCE_DISPLAY_NAME"),
      default: true,
      ui: { component: "switch", width: "small" },
    },
    {
      name: "return_metadata",
      type: "boolean",
      required: false,
      display_name: t("VECTOR_RETURN_METADATA_DISPLAY_NAME"),
      default: false,
      ui: { component: "switch", width: "small" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucketName = String(parameters.vector_bucket_name).trim()
    const indexName = String(parameters.index_name).trim()
    if (!bucketName || !indexName) {
      return {
        success: false,
        error: "vector_bucket_name and index_name are required.",
        data: null,
        code: null,
      }
    }

    const queryVectorRaw = parseJson<{ float32?: number[] }>(parameters.query_vector as string, {})
    const float32 = Array.isArray(queryVectorRaw?.float32) ? queryVectorRaw.float32 : []
    const queryVector = { float32 }

    const topK = Number(parameters.top_k) || 10
    const filter = parseJson<Record<string, unknown> | null>(parameters.filter as string, null)
    const returnDistance = parameters.return_distance !== false
    const returnMetadata = parameters.return_metadata === true

    try {
      const index = clientResult.supabase.storage.vectors.from(bucketName).index(indexName)
      const { data, error } = await index.queryVectors({
        queryVector,
        topK,
        ...(filter && Object.keys(filter).length > 0 && { filter }),
        returnDistance,
        returnMetadata,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          code: (error as { code?: string }).code ?? null,
          data: null,
        }
      }
      return { success: true, data: data ?? null, error: null, code: null } as any
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, data: null, code: null }
    }
  },
} satisfies ToolDefinition
