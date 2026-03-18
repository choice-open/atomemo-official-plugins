import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseStorageRemoveTool = {
  name: "supabase-storage-remove",
  display_name: t("STORAGE_REMOVE_DISPLAY_NAME"),
  description: t("STORAGE_REMOVE_DESCRIPTION"),
  icon: "🗑️",
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
      name: "paths",
      type: "string",
      required: true,
      display_name: t("STORAGE_PATHS_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("STORAGE_PATHS_PLACEHOLDER"),
        hint: t("STORAGE_PATHS_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucket = String(parameters.bucket).trim()
    const pathsRaw = parseJson<string[]>(parameters.paths as string, [])

    if (!bucket) {
      throw new Error("bucket is required.")
    }
    const paths = Array.isArray(pathsRaw)
      ? pathsRaw.map((p) => String(p).trim()).filter(Boolean)
      : [String(pathsRaw).trim()].filter(Boolean)
    if (paths.length === 0) {
      throw new Error(
        'paths must be a non-empty JSON array of file paths (e.g. ["folder/file.png"]).',
      )
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths)

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
