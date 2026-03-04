import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import { t } from "../../i18n/i18n-node"

export const supabaseVectorListIndexesTool = {
  name: "supabase-vector-list-indexes",
  display_name: t("VECTOR_LIST_INDEXES_DISPLAY_NAME"),
  description: t("VECTOR_LIST_INDEXES_DESCRIPTION"),
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
      name: "prefix",
      type: "string",
      required: false,
      display_name: t("VECTOR_PREFIX_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_PREFIX_PLACEHOLDER"),
        hint: t("VECTOR_PREFIX_HINT"),
        width: "medium",
      },
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      display_name: t("VECTOR_MAX_RESULTS_DISPLAY_NAME"),
      default: 100,
      minimum: 1,
      maximum: 1000,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "next_token",
      type: "string",
      required: false,
      display_name: t("VECTOR_NEXT_TOKEN_DISPLAY_NAME"),
      ui: { component: "input", width: "medium" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucketName = String(parameters.vector_bucket_name).trim()
    if (!bucketName) {
      return {
        success: false,
        error: "vector_bucket_name is required.",
        data: null,
        code: null,
      }
    }

    const prefix = (parameters.prefix as string)?.trim() || undefined
    const maxResults = Number(parameters.max_results) || 100
    const nextToken = (parameters.next_token as string)?.trim() || undefined

    try {
      const bucket = clientResult.supabase.storage.vectors.from(bucketName)
      const { data, error } = await bucket.listIndexes({
        prefix,
        maxResults,
        nextToken,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          code: (error as { code?: string }).code ?? null,
          data: null,
        }
      }
      return {
        success: true,
        data: data ?? null,
        error: null,
        code: null,
      } as any
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, data: null, code: null }
    }
  },
} satisfies ToolDefinition
