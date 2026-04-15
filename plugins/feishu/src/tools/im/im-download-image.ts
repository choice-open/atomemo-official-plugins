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
import im_download_imageSkill from "./im-download-image-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_download_image",
  module: "im",
  name: "下载图片",
  method: "GET",
  path: "/open-apis/im/v1/images/{image_key}",
}

function extensionFromFilename(filename: string): string | null {
  const parts = filename.split(".")
  if (parts.length < 2) return null
  const ext = (parts.pop() ?? "").toLowerCase()
  return ext || null
}

function mimeToExtension(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase()
  if (base === "image/png") return "png"
  if (base === "image/jpeg" || base === "image/jpg") return "jpg"
  if (base === "image/webp") return "webp"
  if (base === "image/gif") return "gif"
  if (base === "image/tiff") return "tiff"
  if (base === "image/bmp" || base === "image/x-ms-bmp") return "bmp"
  if (base === "image/x-icon" || base === "image/vnd.microsoft.icon")
    return "ico"
  return "bin"
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

export const feishuImDownloadImageTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Download image",
    zh_Hans: "下载图片",
  },
  description: {
    en_US:
      "Download an image by image key and return an Atomemo file_ref for downstream steps.",
    zh_Hans:
      "通过图片 Key 从飞书下载图片，并上传为可在工作流中复用的 file_ref。",
  },
  skill: im_download_imageSkill,
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
      name: "image_key",
      type: "string",
      required: true,
      display_name: t("IMAGE_KEY"),
      ui: {
        component: "input",
        hint: t("IMAGE_KEY_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"image_key">,
  ],
  invoke: async ({ args, context }): Promise<JsonValue> => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const imageKey = readRequiredStringParam(p, "image_key")

    if (!context?.files) {
      throw new Error("File context is unavailable.")
    }

    const client = createFeishuLarkClient(args.credentials, credentialId)
    const result = await client.im.image.get({
      path: { image_key: imageKey },
    })

    if (!result) {
      throw new Error("Feishu returned an empty response for image download.")
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

    const ext = mimeToExtension(rawType)
    const filename = `${imageKey.replace(/[/\\]/g, "_")}.${ext}`
    const contentBase64 = buffer.toString("base64")

    // 与 google-drive download-a-file 一致：组装 FileRef 后 upload，并直接返回结果
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
