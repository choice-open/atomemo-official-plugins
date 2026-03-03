import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import { t } from "../../i18n/i18n-node"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || String(input).trim() === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseVectorGetTool = {
  name: "supabase-vector-get",
  display_name: t("VECTOR_GET_DISPLAY_NAME"),
  description: t("VECTOR_GET_DESCRIPTION"),
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
      name: "keys",
      type: "string",
      required: true,
      display_name: t("VECTOR_KEYS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_KEYS_PLACEHOLDER"),
        hint: t("VECTOR_KEYS_HINT"),
        width: "full",
      },
    },
    {
      name: "return_data",
      type: "boolean",
      required: false,
      display_name: t("VECTOR_RETURN_DATA_DISPLAY_NAME"),
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

    const keysRaw = parseJson<string[]>(parameters.keys as string, [])
    const keys = Array.isArray(keysRaw) ? keysRaw.map(String) : []
    if (keys.length === 0) {
      return {
        success: false,
        error: "keys must be a non-empty JSON array of vector keys.",
        data: null,
        code: null,
      }
    }

    const returnData = parameters.return_data !== false
    const returnMetadata = parameters.return_metadata === true

    try {
      const index = clientResult.supabase.storage.vectors.from(bucketName).index(indexName)
      const { data, error } = await index.getVectors({
        keys,
        returnData,
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
