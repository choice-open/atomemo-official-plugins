import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../../wechat-work/client"
import uploadImageSkill from "./upload-image-skill.md" with { type: "text" }

type UploadImageResponse = {
  errcode?: number
  errmsg?: string
  url?: string
}

const IMAGE_MAX_SIZE = 2 * 1024 * 1024
const IMAGE_MIN_SIZE = 5

export const uploadImageTool: ToolDefinition = {
  name: "wechat-work-upload-image",
  display_name: {
    en_US: "Upload Image",
    zh_Hans: "上传图片",
  },
  description: {
    en_US: "Upload an image to WeChat Work and get a permanent URL for use in rich-text messages or welcome messages.",
    zh_Hans: "上传图片得到图片URL，该URL永久有效。返回的图片URL，仅能用于图文消息正文中的图片展示，或者给客户发送欢迎语等。",
  },
  skill: uploadImageSkill,
  icon: "📷",
  parameters: [
    {
      name: "wechat_work_credential",
      type: "credential_id",
      required: true,
      credential_name: "wechat-work",
      display_name: {
        en_US: "WeChat Work Credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "media",
      type: "file_ref",
      required: true,
      display_name: {
        en_US: "Image File",
        zh_Hans: "图片文件",
      },
      ui: {
        hint: {
          en_US: "Image file to upload (5B ~ 2MB). Each enterprise can upload up to 1000 images per day and 3000 per month.",
          zh_Hans: "要上传的图片文件（5B ~ 2MB）。每个企业每天最多可上传1000张图片，每月最多可上传3000张图片。",
        },
      },
    },
  ],
  async invoke({ args, context }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      media?: unknown
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    if (!params.media) {
      throw new Error("media file is required.")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      )
    }

    const fileRef = context.files.parseFileRef(params.media)
    const downloaded = await context.files.download(fileRef)

    if (!downloaded.content) {
      throw new Error("Failed to download file content.")
    }

    const fileSize = downloaded.size ?? 0
    if (fileSize > IMAGE_MAX_SIZE) {
      throw new Error(`Image file size exceeds 2MB limit. Current size: ${(fileSize / (1024 * 1024)).toFixed(2)}MB`)
    }
    if (fileSize < IMAGE_MIN_SIZE) {
      throw new Error("Image file size must be at least 5 bytes")
    }

    const fileContent = Buffer.from(downloaded.content, "base64")
    const filename = downloaded.filename ?? "image.png"
    const formData = new FormData()
    formData.append(
      "media",
      new File([fileContent], filename, {
        type: downloaded.mime_type ?? "image/png",
      }),
    )

    const url = new URL(
      "https://qyapi.weixin.qq.com/cgi-bin/media/uploadimg",
    )
    url.searchParams.set("access_token", token)

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    })
    const data = (await res.json()) as UploadImageResponse
    if (data.errcode !== undefined && data.errcode !== 0) {
      throw new Error(
        data.errmsg ?? `WeChat Work API error (errcode=${String(data.errcode)})`,
      )
    }
    return { url: data.url ?? "" }
  },
}