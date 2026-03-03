import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import { t } from "../../i18n/i18n-node"

export const supabaseVectorListTool = {
  name: "supabase-vector-list",
  display_name: t("VECTOR_LIST_DISPLAY_NAME"),
  description: t("VECTOR_LIST_DESCRIPTION"),
  icon: "📐",
  parameters: [
    { name: "supabase_credential", type: "credential_id", required: true, display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"), credential_name: "supabase-connection" },
    { name: "vector_bucket_name", type: "string", required: true, display_name: t("VECTOR_BUCKET_NAME_DISPLAY_NAME"), ui: { component: "input", placeholder: t("VECTOR_BUCKET_NAME_PLACEHOLDER"), hint: t("VECTOR_BUCKET_NAME_HINT"), support_expression: true, width: "full" } },
    { name: "index_name", type: "string", required: true, display_name: t("VECTOR_INDEX_NAME_DISPLAY_NAME"), ui: { component: "input", placeholder: t("VECTOR_INDEX_NAME_PLACEHOLDER"), hint: t("VECTOR_INDEX_NAME_HINT"), support_expression: true, width: "full" } },
    { name: "max_results", type: "integer", required: false, display_name: t("VECTOR_MAX_RESULTS_DISPLAY_NAME"), default: 500, minimum: 1, maximum: 1000, ui: { component: "number-input", width: "small" } },
    { name: "next_token", type: "string", required: false, display_name: t("VECTOR_NEXT_TOKEN_DISPLAY_NAME"), ui: { component: "input", width: "medium" } },
    { name: "return_data", type: "boolean", required: false, display_name: t("VECTOR_RETURN_DATA_DISPLAY_NAME"), default: false, ui: { component: "switch", width: "small" } },
    { name: "return_metadata", type: "boolean", required: false, display_name: t("VECTOR_RETURN_METADATA_DISPLAY_NAME"), default: false, ui: { component: "switch", width: "small" } },
    { name: "segment_count", type: "integer", required: false, display_name: t("VECTOR_SEGMENT_COUNT_DISPLAY_NAME"), minimum: 1, maximum: 16, ui: { component: "number-input", width: "small" } },
    { name: "segment_index", type: "integer", required: false, display_name: t("VECTOR_SEGMENT_INDEX_DISPLAY_NAME"), minimum: 0, ui: { component: "number-input", width: "small" } },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error
    const bucketName = String(parameters.vector_bucket_name).trim()
    const indexName = String(parameters.index_name).trim()
    if (!bucketName || !indexName) {
      return { success: false, error: "vector_bucket_name and index_name are required.", data: null, code: null }
    }
    const maxResults = Number(parameters.max_results) || 500
    const nextToken = (parameters.next_token as string)?.trim() || undefined
    const returnData = parameters.return_data === true
    const returnMetadata = parameters.return_metadata === true
    const segmentCount = parameters.segment_count != null ? Number(parameters.segment_count) : undefined
    const segmentIndex = parameters.segment_index != null ? Number(parameters.segment_index) : undefined
    try {
      const index = clientResult.supabase.storage.vectors.from(bucketName).index(indexName)
      const { data, error } = await index.listVectors({
        maxResults,
        nextToken,
        returnData,
        returnMetadata,
        ...(segmentCount != null && { segmentCount }),
        ...(segmentIndex != null && { segmentIndex }),
      })
      if (error) {
        return { success: false, error: error.message, code: (error as { code?: string }).code ?? null, data: null }
      }
      return { success: true, data: data ?? null, error: null, code: null } as any
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, data: null, code: null }
    }
  },
} satisfies ToolDefinition
