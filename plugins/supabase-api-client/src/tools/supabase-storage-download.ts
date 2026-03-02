import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  if (typeof Buffer !== "undefined") {
    return Buffer.from(buffer).toString("base64")
  }
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return typeof btoa !== "undefined" ? btoa(binary) : ""
}

export const supabaseStorageDownloadTool = {
  name: "supabase-storage-download",
  display_name: t("STORAGE_DOWNLOAD_DISPLAY_NAME"),
  description: t("STORAGE_DOWNLOAD_DESCRIPTION"),
  icon: "📥",
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

    try {
      const { data: blob, error } = await clientResult.supabase.storage
        .from(bucket)
        .download(path)

      if (error) {
        return {
          success: false,
          error: error.message,
          code: (error as { code?: string }).code ?? null,
          data: null,
        }
      }
      if (!blob) {
        return {
          success: false,
          error: "No data returned.",
          data: null,
          code: null,
        }
      }

      const contentBase64 = await blobToBase64(blob)
      return {
        success: true,
        data: {
          content_base64: contentBase64,
          content_type: blob.type || "application/octet-stream",
          size: blob.size,
        },
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
