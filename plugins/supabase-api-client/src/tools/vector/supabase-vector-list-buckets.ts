import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import { t } from "../../i18n/i18n-node"

export const supabaseVectorListBucketsTool = {
  name: "supabase-vector-list-buckets",
  display_name: t("VECTOR_LIST_BUCKETS_DISPLAY_NAME"),
  description: t("VECTOR_LIST_BUCKETS_DESCRIPTION"),
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

    const prefix = (parameters.prefix as string)?.trim() || undefined
    const maxResults = Number(parameters.max_results) || 100
    const nextToken = (parameters.next_token as string)?.trim() || undefined

    try {
      const { data, error } = await clientResult.supabase.storage.vectors.listBuckets({
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
      return {
        success: false,
        error: message,
        data: null,
        code: null,
      }
    }
  },
} satisfies ToolDefinition
