import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseStorageCreateBucketSkill from "./supabase-storage-create-bucket-skill.md" with { type: "text" }

export const supabaseStorageCreateBucketTool = {
  name: "supabase-storage-create-bucket",
  display_name: t("STORAGE_CREATE_BUCKET_DISPLAY_NAME"),
  description: t("STORAGE_CREATE_BUCKET_DESCRIPTION"),
  skill: supabaseStorageCreateBucketSkill,
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
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucket = String(parameters.bucket ?? "").trim()
    if (!bucket) {
      throw new Error("bucket is required.")
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
        throw new Error(
          'allowed_mime_types must be a valid JSON array of MIME types (e.g. ["image/*"]).',
        )
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
      const { data, error } = await supabase.storage.createBucket(bucket, options)

      if (error) {
        const e: any = new Error(error.message)
        e.code = (error as { code?: string }).code ?? null
        throw e
      }
      return {
        success: true,
        data: data ?? { name: bucket },
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
