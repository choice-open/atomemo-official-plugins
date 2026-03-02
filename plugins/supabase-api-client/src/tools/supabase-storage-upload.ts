import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"

export const supabaseStorageUploadTool = {
  name: "supabase-storage-upload",
  display_name: t("STORAGE_UPLOAD_DISPLAY_NAME"),
  description: t("STORAGE_UPLOAD_DESCRIPTION"),
  icon: "📤",
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
        hint: t("STORAGE_PATH_UPLOAD_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "file_content",
      type: "string",
      required: true,
      display_name: t("STORAGE_FILE_CONTENT_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("STORAGE_FILE_CONTENT_PLACEHOLDER"),
        hint: t("STORAGE_FILE_CONTENT_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content_type",
      type: "string",
      required: false,
      display_name: t("STORAGE_CONTENT_TYPE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("STORAGE_CONTENT_TYPE_PLACEHOLDER"),
        hint: t("STORAGE_CONTENT_TYPE_HINT"),
        width: "medium",
      },
    },
    {
      name: "upsert",
      type: "boolean",
      required: false,
      display_name: t("STORAGE_UPSERT_DISPLAY_NAME"),
      default: false,
      ui: { component: "switch", hint: t("STORAGE_UPSERT_HINT") },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()
    const fileContent = parameters.file_content as string
    const contentType =
      (parameters.content_type as string)?.trim() || "application/octet-stream"
    const upsert = Boolean(parameters.upsert)

    if (!bucket || !path) {
      return {
        success: false,
        error: "bucket and path are required.",
        data: null,
        code: null,
      }
    }
    if (fileContent == null || fileContent === "") {
      return {
        success: false,
        error: "file_content is required (base64 string or plain text).",
        data: null,
        code: null,
      }
    }

    let body: Buffer | Uint8Array | string
    const trimmed = typeof fileContent === "string" ? fileContent.trim() : ""
    if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0) {
      try {
        body = Buffer.from(trimmed, "base64")
      } catch {
        body = trimmed
      }
    } else {
      body = trimmed
    }

    try {
      const { data, error } = await clientResult.supabase.storage
        .from(bucket)
        .upload(path, body, { contentType, upsert })

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
