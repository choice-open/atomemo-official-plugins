import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseStorageGetPublicUrlTool = {
  name: "supabase-storage-get-public-url",
  display_name: t("STORAGE_GET_PUBLIC_URL_DISPLAY_NAME"),
  description: t("STORAGE_GET_PUBLIC_URL_DESCRIPTION"),
  icon: "🌐",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "bucket",
      type: "string",
      required: true,
      display_name: t("STORAGE_BUCKET_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("STORAGE_BUCKET_PLACEHOLDER"),
        hint: t("STORAGE_BUCKET_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "path",
      type: "string",
      required: true,
      display_name: t("STORAGE_PATH_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("STORAGE_PATH_PLACEHOLDER"),
        hint: t("STORAGE_PATH_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()

    if (!bucket || !path) {
      return {
        success: false,
        error: "bucket and path are required.",
        data: null,
        code: null,
      }
    }

    const { data } = clientResult.supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return {
      success: true,
      data,
      error: null,
      code: null,
    } as any
  },
} satisfies ToolDefinition
