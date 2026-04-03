import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseStorageDownloadSkill from "./supabase-storage-download-skill.md" with { type: "text" }

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
  skill: supabaseStorageDownloadSkill,
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
  async invoke({ args, context }) {
    const { parameters, credentials } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)

    const bucket = String(parameters.bucket).trim()
    const path = String(parameters.path).trim()

    if (!bucket || !path) {
      throw new Error("bucket and path are required.")
    }

    try {
      const { data: blob, error } = await supabase.storage
        .from(bucket)
        .download(path)

      if (error) {
        const e: any = new Error(error.message)
        e.code = (error as { code?: string }).code ?? null
        throw e
      }
      if (!blob) {
        throw new Error("No data returned.")
      }

      const contentBase64 = await blobToBase64(blob)
      const filename = path.split("/").filter(Boolean).pop() ?? "download"
      const extension = filename.includes(".") ? filename.split(".").pop() ?? null : null

      const uploaded = await context.files.upload(
        {
          __type__: "file_ref",
          source: "mem",
          filename,
          extension,
          mime_type: blob.type || "application/octet-stream",
          size: blob.size,
          res_key: null,
          remote_url: null,
          content: contentBase64,
        },
        {},
      )

      return {
        success: true,
        data: uploaded,
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
