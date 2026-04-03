import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseVectorDeleteSkill from "./supabase-vector-delete-skill.md" with { type: "text" }

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || String(input).trim() === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseVectorDeleteTool = {
  name: "supabase-vector-delete",
  display_name: t("VECTOR_DELETE_DISPLAY_NAME"),
  description: t("VECTOR_DELETE_DESCRIPTION"),
  skill: supabaseVectorDeleteSkill,
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
        hint: t("VECTOR_DELETE_KEYS_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucketName = String(parameters.vector_bucket_name).trim()
    const indexName = String(parameters.index_name).trim()
    if (!bucketName || !indexName) {
      throw new Error("vector_bucket_name and index_name are required.")
    }

    const keysRaw = parseJson<string[]>(parameters.keys as string, [])
    const keys = Array.isArray(keysRaw) ? keysRaw.map(String) : []
    if (keys.length === 0) {
      throw new Error("keys must be a non-empty JSON array of vector keys (1-500).")
    }
    if (keys.length > 500) {
      throw new Error("keys batch size must be between 1 and 500.")
    }

    try {
      const index = supabase.storage.vectors
        .from(bucketName)
        .index(indexName)
      const { error } = await index.deleteVectors({ keys })

      if (error) {
        const e: any = new Error(error.message)
        e.code = (error as { code?: string }).code ?? null
        throw e
      }
      return { success: true, data: null, error: null, code: null } as any
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error(String(err))
    }
  },
} satisfies ToolDefinition
