import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"
import { t } from "../i18n/i18n-node"

function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || String(input).trim() === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export const supabaseVectorCreateIndexTool = {
  name: "supabase-vector-create-index",
  display_name: t("VECTOR_CREATE_INDEX_DISPLAY_NAME"),
  description: t("VECTOR_CREATE_INDEX_DESCRIPTION"),
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
      name: "data_type",
      type: "string",
      required: true,
      display_name: t("VECTOR_DATA_TYPE_DISPLAY_NAME"),
      default: "float32",
      ui: {
        component: "select",
        options: [{ value: "float32", label: t("VECTOR_LABEL_FLOAT32") }],
        width: "small",
      },
    },
    {
      name: "dimension",
      type: "integer",
      required: true,
      display_name: t("VECTOR_DIMENSION_DISPLAY_NAME"),
      minimum: 1,
      maximum: 10000,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "distance_metric",
      type: "string",
      required: true,
      display_name: t("VECTOR_DISTANCE_METRIC_DISPLAY_NAME"),
      default: "cosine",
      ui: {
        component: "select",
        options: [
          { value: "cosine", label: t("VECTOR_LABEL_COSINE") },
          { value: "euclidean", label: t("VECTOR_LABEL_EUCLIDEAN") },
          { value: "dotproduct", label: t("VECTOR_LABEL_DOTPRODUCT") },
        ],
        width: "small",
      },
    },
    {
      name: "metadata_configuration",
      type: "string",
      required: false,
      display_name: t("VECTOR_METADATA_CONFIG_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("VECTOR_METADATA_CONFIG_PLACEHOLDER"),
        hint: t("VECTOR_METADATA_CONFIG_HINT"),
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucketName = String(parameters.vector_bucket_name).trim()
    const indexName = String(parameters.index_name).trim()
    if (!bucketName || !indexName) {
      return {
        success: false,
        error: "vector_bucket_name and index_name are required.",
        data: null,
        code: null,
      }
    }

    const dataType = "float32"
    const dimension = Number(parameters.dimension)
    const rawMetric = String(parameters.distance_metric)
    const distanceMetric =
      rawMetric === "euclidean" || rawMetric === "dotproduct" ? rawMetric : "cosine"
    const metadataConfiguration = parseJson<{ nonFilterableMetadataKeys?: string[] } | null>(
      parameters.metadata_configuration as string,
      null
    )

    try {
      const bucket = clientResult.supabase.storage.vectors.from(bucketName)
      const options: Parameters<typeof bucket.createIndex>[0] = {
        indexName,
        dataType,
        dimension,
        distanceMetric,
      }
      if (metadataConfiguration) options.metadataConfiguration = metadataConfiguration

      const { error } = await bucket.createIndex(options)

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
        data: { vectorBucketName: bucketName, indexName },
        error: null,
        code: null,
      } as any
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message, data: null, code: null }
    }
  },
} satisfies ToolDefinition
