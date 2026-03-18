import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseStorageListBucketsTool = {
  name: "supabase-storage-list-buckets",
  display_name: t("STORAGE_LIST_BUCKETS_DISPLAY_NAME"),
  description: t("STORAGE_LIST_BUCKETS_DESCRIPTION"),
  icon: "📦",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "limit",
      type: "integer",
      required: false,
      display_name: t("STORAGE_LIMIT_DISPLAY_NAME"),
      default: 100,
      minimum: 1,
      maximum: 1000,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "offset",
      type: "integer",
      required: false,
      display_name: t("STORAGE_OFFSET_DISPLAY_NAME"),
      default: 0,
      minimum: 0,
      ui: { component: "number-input", width: "small" },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const storage = supabase.storage
    const limit = Number(parameters.limit) ?? 100
    const offset = Number(parameters.offset) ?? 0

    try {
      const { data, error } = await storage.listBuckets({
        limit,
        offset,
      })

      if (error) {
        const e: any = new Error(error.message)
        e.code = (error as { code?: string }).code ?? null
        throw e
      }
      return {
        success: true,
        data: data ?? [],
        error: null,
        code: null,
      } as any
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error(String(err))
    }
  },
} satisfies ToolDefinition
