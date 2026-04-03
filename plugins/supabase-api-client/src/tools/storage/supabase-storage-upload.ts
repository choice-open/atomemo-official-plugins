import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseStorageUploadSkill from "./supabase-storage-upload-skill.md" with { type: "text" }

export const supabaseStorageUploadTool = {
  name: "supabase-storage-upload",
  display_name: t("STORAGE_UPLOAD_DISPLAY_NAME"),
  description: t("STORAGE_UPLOAD_DESCRIPTION"),
  skill: supabaseStorageUploadSkill,
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
      name: "file",
      type: "file_ref",
      required: false,
      display_name: t("STORAGE_FILE_REF_DISPLAY_NAME"),
      ui: {
        hint: t("STORAGE_FILE_REF_HINT"),
        width: "full",
      },
    },
    {
      name: "file_content",
      type: "string",
      required: false,
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
  async invoke({ args, context }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()
    const fileRef = parameters.file
    const fileContent = parameters.file_content as string
    let contentType =
      (parameters.content_type as string)?.trim() || "application/octet-stream"
    const upsert = Boolean(parameters.upsert)

    if (!bucket || !path) {
      throw new Error("bucket and path are required.")
    }
    const hasFileRef = fileRef != null
    const hasFileContent = fileContent != null && String(fileContent).trim() !== ""

    if (hasFileRef && hasFileContent) {
      throw new Error(
        "Please provide either file (file_ref) or file_content, not both.",
      )
    }

    if (!hasFileRef && !hasFileContent) {
      throw new Error(
        "file or file_content is required. Provide a file_ref via file, or a base64/plain string via file_content.",
      )
    }

    const normalizedPath = path.replace(/^\/*/, "").replace(/\/*$/, "")
    const lastSegment = normalizedPath.split("/").filter(Boolean).pop() ?? ""
    const hasExplicitFilenameInPath =
      lastSegment.length > 0 && lastSegment.includes(".")

    if (hasFileRef && hasExplicitFilenameInPath) {
      throw new Error(
        "When using file_ref, path must be a directory path without filename (e.g. folder/subfolder). The final filename comes from file_ref.",
      )
    }

    if (hasFileContent && (!normalizedPath || normalizedPath.endsWith("/") || !hasExplicitFilenameInPath)) {
      throw new Error(
        "When using file_content, path must include the filename (e.g. folder/file.png).",
      )
    }

    let body: Buffer | Uint8Array | string
    let finalPath = normalizedPath

    if (hasFileRef && context?.files) {
      try {
        const parsed = context.files.parseFileRef(fileRef as any)
        const downloaded = await context.files.download(parsed)
        const base64Content = downloaded.content ?? ""
        const bytes = new Uint8Array(
          Buffer.from(base64Content, "base64"),
        )
        body = bytes
        // When using file_ref, always use mime_type from file_ref and ignore parameters.content_type
        contentType = downloaded.mime_type || "application/octet-stream"

        const filename =
          downloaded.filename || parsed.filename || parsed.remote_url || null
        const safeFilename =
          typeof filename === "string"
            ? filename.split("/").filter(Boolean).pop() ?? null
            : null

        if (!safeFilename) {
          throw new Error(
            "file_ref must include filename (or be downloadable with filename) to construct the final storage path.",
          )
        }

        finalPath = finalPath ? `${finalPath}/${safeFilename}` : safeFilename
      } catch (err) {
        if (err instanceof Error) {
          const e: any = new Error(`Failed to read file_ref: ${err.message}`)
          e.code = (err as any).code ?? null
          throw e
        }
        throw new Error(`Failed to read file_ref: ${String(err)}`)
      }
    } else {
      const trimmed =
        typeof fileContent === "string" ? fileContent.trim() : ""
      if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0) {
        try {
          body = Buffer.from(trimmed, "base64")
        } catch {
          body = trimmed
        }
      } else {
        body = trimmed
      }
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(finalPath, body, { contentType, upsert })

      if (error) {
        const e: any = new Error(error.message)
        e.code = (error as { code?: string }).code ?? null
        throw e
      }
      return {
        success: true,
        data: data ?? null,
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
