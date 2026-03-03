import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseStorageCreateSignedUrlTool = {
  name: "supabase-storage-create-signed-url",
  display_name: t("STORAGE_CREATE_SIGNED_URL_DISPLAY_NAME"),
  description: t("STORAGE_CREATE_SIGNED_URL_DESCRIPTION"),
  icon: "🔗",
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
    {
      name: "expires_in",
      type: "integer",
      required: false,
      display_name: t("STORAGE_EXPIRES_IN_DISPLAY_NAME"),
      default: 3600,
      minimum: 1,
      maximum: 86400,
      ui: {
        component: "number-input",
        width: "small",
        hint: t("STORAGE_EXPIRES_IN_HINT"),
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()
    const expiresIn = Number(parameters.expires_in) || 3600

    if (!bucket || !path) {
      return {
        success: false,
        error: "bucket and path are required.",
        data: null,
        code: null,
      }
    }

    try {
      const { data, error } = await clientResult.supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

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
