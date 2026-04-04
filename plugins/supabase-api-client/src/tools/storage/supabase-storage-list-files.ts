import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseStorageListFilesSkill from "./supabase-storage-list-files-skill.md" with { type: "text" }

export const supabaseStorageListFilesTool = {
  name: "supabase-storage-list-files",
  display_name: t("STORAGE_LIST_FILES_DISPLAY_NAME"),
  description: t("STORAGE_LIST_FILES_DESCRIPTION"),
  skill: supabaseStorageListFilesSkill,
  icon: "📂",
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
      required: false,
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

    const bucket = String(parameters.bucket).trim()
    if (!bucket) {
      throw new Error("bucket is required.")
    }

    const path = (parameters.path as string)?.trim() || ""
    const limit = Number(parameters.limit) ?? 100
    const offset = Number(parameters.offset) ?? 0

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, { limit, offset, sortBy: { column: "name", order: "asc" } })

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
