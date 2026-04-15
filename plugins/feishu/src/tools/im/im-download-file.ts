import type {
  FileRef,
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  createFeishuLarkClient,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import im_download_fileSkill from "./im-download-file-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_download_file",
  module: "im",
  name: "下载文件",
  method: "GET",
  path: "/open-apis/im/v1/files/{file_key}",
}

function extensionFromFilename(filename: string): string | null {
  const parts = filename.split(".")
  if (parts.length < 2) return null
  const ext = (parts.pop() ?? "").toLowerCase()
  return ext || null
}

/** 与 im-download-image 同思路，补充常见文档/音视频 MIME。 */
function extFromMime(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase()
  const m: Record<string, string> = {
    "application/pdf": "pdf",
    "application/zip": "zip",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "text/plain": "txt",
    "text/csv": "csv",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "video/mp4": "mp4",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/octet-stream": "bin",
  }
  return m[base] ?? "bin"
}

async function readableToBuffer(
  stream: AsyncIterable<Uint8Array | string | Buffer>,
): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

export const feishuImDownloadFileTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Download file",
    zh_Hans: "下载文件",
  },
  description: {
    en_US:
      "Download a file by file key and return an Atomemo file_ref for downstream steps.",
    zh_Hans:
      "通过文件 Key 从飞书下载文件，并上传为可在工作流中复用的 file_ref。",
  },
  skill: im_download_fileSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "file_key",
      type: "string",
      required: true,
      display_name: t("FILE_KEY"),
      ui: {
        component: "input",
        hint: t("FILE_KEY_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"file_key">,
  ],
  invoke: async ({ args, context }): Promise<JsonValue> => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const fileKey = readRequiredStringParam(p, "file_key")

    if (!context?.files) {
      throw new Error("File context is unavailable.")
    }

    const client = createFeishuLarkClient(args.credentials, credentialId)
    const result = await client.im.file.get({
      path: { file_key: fileKey },
    })

    if (!result) {
      throw new Error("Feishu returned an empty response for file download.")
    }

    const stream = result.getReadableStream()
    const buffer = await readableToBuffer(stream as AsyncIterable<Uint8Array>)

    const headers = result.headers as Record<string, unknown> | undefined
    const rawType =
      headers &&
      typeof headers["content-type"] === "string" &&
      headers["content-type"].trim() !== ""
        ? headers["content-type"].trim()
        : "application/octet-stream"

    const ext = extFromMime(rawType)
    const filename = `${fileKey.replace(/[/\\]/g, "_")}.${ext}`
    const contentBase64 = buffer.toString("base64")

    const fileRef: FileRef = {
      __type__: "file_ref",
      source: "mem",
      filename,
      content: contentBase64,
      mime_type: rawType.split(";")[0]?.trim() ?? rawType,
      extension: extensionFromFilename(filename),
      size: buffer.length,
      res_key: null,
      remote_url: null,
    }

    return (await context.files.upload(fileRef, {})) as JsonValue
  },
}
