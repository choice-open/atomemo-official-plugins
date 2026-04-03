import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseVectorPutSkill from "./supabase-vector-put-skill.md" with { type: "text" }

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
  skill: supabaseVectorPutSkill,
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
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucketName = String(parameters.vector_bucket_name).trim()
    const indexName = String(parameters.index_name).trim()
    if (!bucketName || !indexName) {
      throw new Error("vector_bucket_name and index_name are required.")
    }

    const vectorsRaw = parseJson<VectorInput[]>(
      parameters.vectors as string,
      [],
    )
    if (!Array.isArray(vectorsRaw) || vectorsRaw.length === 0) {
      throw new Error(
        "vectors must be a non-empty JSON array of { key, data: { float32: number[] }, metadata? }.",
      )
    }
    if (vectorsRaw.length > 500) {
      throw new Error("vectors batch size must be between 1 and 500.")
    }

    const vectors = vectorsRaw.map((v) => ({
      key: String(v.key),
      data: { float32: Array.isArray(v.data?.float32) ? v.data.float32 : [] },
      ...(v.metadata != null &&
        typeof v.metadata === "object" && { metadata: v.metadata }),
    }))

    try {
      const index = supabase.storage.vectors
        .from(bucketName)
        .index(indexName)
      const { error } = await index.putVectors({ vectors })

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
