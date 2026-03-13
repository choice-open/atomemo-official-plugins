import type { Property, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

type ParameterNames = "temp_url"

const parameters: Array<Property<ParameterNames>> = [
  {
    name: "temp_url",
    type: "string",
    required: true,
    display_name: t("DOWNLOAD_FILE_PARAM_TEMP_URL_LABEL"),
  },
]

export const downloadAFileTool: ToolDefinition = {
  name: "google-drive-download-file",
  display_name: t("DOWNLOAD_FILE_TOOL_DISPLAY_NAME"),
  description: t("DOWNLOAD_FILE_TOOL_DESCRIPTION"),
  icon: "⬇️",
  parameters,
  invoke: async ({ args, context }) => {
    // const p = (args.parameters ?? {}) as Record<string, unknown>
    // const tempUrl = typeof p.temp_url === "string" ? p.temp_url.trim() : ""
    // if (!tempUrl) throw new Error("Missing temp_url")

    // const res = await fetch(tempUrl)
    // if (!res.ok) {
    //   throw new Error(
    //     `Failed to download file from URL (HTTP ${res.status}): ${tempUrl}`,
    //   )
    // }

    // const arrayBuffer = await res.arrayBuffer()
    // const bytes = new Uint8Array(arrayBuffer)
    // const contentBase64 = Buffer.from(bytes).toString("base64")

    // const urlObj = new URL(tempUrl)
    // const pathSegments = urlObj.pathname.split("/").filter(Boolean)
    // const filename = pathSegments.pop() ?? "download"
    // const parts = filename.split(".")
    // const extension =
    //   parts.length > 1 ? (parts.pop() ?? "").toLowerCase() || null : null
    // const mimeType =
    //   res.headers.get("content-type")?.split(";")[0]?.trim() ??
    //   "application/octet-stream"

    // const fileRef: FileRef = {
    //   __type__: "file_ref" as const,
    //   source: "mem" as const,
    //   filename,
    //   content: contentBase64,
    //   mime_type: mimeType,
    //   extension,
    //   size: bytes.length,
    // }

    // const uploadResult = await context.files.upload(fileRef, {})
    // console.log(uploadResult)
    return {
      a: 2
    }
  },
}
