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

interface VectorInput {
  key: string
  data: { float32: number[] }
  metadata?: Record<string, unknown>
}

export const supabaseVectorPutTool = {
  name: "supabase-vector-put",
  display_name: t("VECTOR_PUT_DISPLAY_NAME"),
  description: t("VECTOR_PUT_DESCRIPTION"),
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
      name: "vectors",
      type: "string",
      required: true,
      display_name: t("VECTOR_PUT_VECTORS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_PUT_VECTORS_PLACEHOLDER"),
        hint: t("VECTOR_PUT_VECTORS_HINT"),
        width: "full",
      },
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

    const vectorsRaw = parseJson<VectorInput[]>(parameters.vectors as string, [])
    if (!Array.isArray(vectorsRaw) || vectorsRaw.length === 0) {
      return {
        success: false,
        error: "vectors must be a non-empty JSON array of { key, data: { float32: number[] }, metadata? }.",
        data: null,
        code: null,
      }
    }
    if (vectorsRaw.length > 500) {
      return {
        success: false,
        error: "vectors batch size must be between 1 and 500.",
        data: null,
        code: null,
      }
    }

    const vectors = vectorsRaw.map((v) => ({
      key: String(v.key),
      data: { float32: Array.isArray(v.data?.float32) ? v.data.float32 : [] },
      ...(v.metadata != null && typeof v.metadata === "object" && { metadata: v.metadata }),
    }))

    try {
      const index = clientResult.supabase.storage.vectors.from(bucketName).index(indexName)
      const { error } = await index.putVectors({ vectors })

      if (error) {
        return {
          success: false,
          error: error.message,
          code: (error as { code?: string }).code ?? null,
          data: null,
        }
      }
      return { success: true, data: null, error: null, code: null } as any
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, data: null, code: null }
    }
  },
} satisfies ToolDefinition
