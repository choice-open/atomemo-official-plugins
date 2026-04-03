import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseStorageGetPublicUrlSkill from "./supabase-storage-get-public-url-skill.md" with { type: "text" }

export const supabaseStorageGetPublicUrlTool = {
  name: "supabase-storage-get-public-url",
  display_name: t("STORAGE_GET_PUBLIC_URL_DISPLAY_NAME"),
  description: t("STORAGE_GET_PUBLIC_URL_DESCRIPTION"),
  skill: supabaseStorageGetPublicUrlSkill,
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
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()

    if (!bucket || !path) {
      throw new Error("bucket and path are required.")
    }

    const { data } = supabase.storage
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
