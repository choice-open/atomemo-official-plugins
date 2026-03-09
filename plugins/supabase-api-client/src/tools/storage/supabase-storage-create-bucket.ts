import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseStorageCreateBucketTool = {
  name: "supabase-storage-create-bucket",
  display_name: t("STORAGE_CREATE_BUCKET_DISPLAY_NAME"),
  description: t("STORAGE_CREATE_BUCKET_DESCRIPTION"),
  icon: "📦",
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
      name: "public",
      type: "boolean",
      required: false,
      display_name: t("STORAGE_PUBLIC_DISPLAY_NAME"),
      default: false,
      ui: { component: "switch", hint: t("STORAGE_PUBLIC_HINT") },
    },
    {
      name: "file_size_limit",
      type: "string",
      required: false,
      display_name: t("STORAGE_FILE_SIZE_LIMIT_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("STORAGE_FILE_SIZE_LIMIT_PLACEHOLDER"),
        hint: t("STORAGE_FILE_SIZE_LIMIT_HINT"),
        width: "small",
      },
    },
    {
      name: "allowed_mime_types",
      type: "string",
      required: false,
      display_name: t("STORAGE_ALLOWED_MIME_TYPES_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("STORAGE_ALLOWED_MIME_TYPES_PLACEHOLDER"),
        hint: t("STORAGE_ALLOWED_MIME_TYPES_HINT"),
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const bucket = String(parameters.bucket ?? "").trim()
    if (!bucket) {
      return {
        success: false,
        error: "bucket is required.",
        data: null,
        code: null,
      }
    }

    let allowedMimeTypes: string[] | undefined
    const rawAllowed = parameters.allowed_mime_types
    if (rawAllowed != null && String(rawAllowed).trim() !== "") {
      try {
        const parsed = JSON.parse(String(rawAllowed))
        if (Array.isArray(parsed)) {
          allowedMimeTypes = parsed.map((x) => String(x))
        }
      } catch {
        return {
          success: false,
          error:
            'allowed_mime_types must be a valid JSON array of MIME types (e.g. ["image/*"]).',
          data: null,
          code: null,
        }
      }
    }

    const fileSizeLimit = String(parameters.file_size_limit ?? "").trim()
    const options = {
      public: parameters.public === true,
      ...(fileSizeLimit && { fileSizeLimit }),
      ...(allowedMimeTypes &&
        allowedMimeTypes.length > 0 && { allowedMimeTypes }),
    }

    try {
      const { data, error } = await clientResult.supabase.storage.createBucket(
        bucket,
        options,
      )

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
        data: data ?? { name: bucket },
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
