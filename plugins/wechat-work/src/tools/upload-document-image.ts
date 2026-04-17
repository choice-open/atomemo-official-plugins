import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import uploadDocumentImageSkill from "./upload-document-image-skill.md" with { type: "text" }

type UploadDocumentImageResponse = {
  errcode?: number
  errmsg?: string
  url?: string
}

export const uploadDocumentImageTool: ToolDefinition = {
  name: "wechat-work-upload-document-image",
  display_name: {
    en_US: "Upload document image",
    zh_Hans: "上传文档图片",
  },
  description: {
    en_US: "Upload an image to WeChat Work documents for use in documents.",
    zh_Hans: "上传图片到企业微信文档，用于文档中引用。",
  },
  skill: uploadDocumentImageSkill,
  icon: "🖼️",
  parameters: [
    {
      name: "wechat_work_credential",
      type: "credential_id",
      required: true,
      credential_name: "wechat-work",
      display_name: {
        en_US: "WeChat Work credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "media",
      type: "string",
      required: true,
      display_name: {
        en_US: "Image file (base64)",
        zh_Hans: "图片文件 (base64)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Image file content as base64 string",
          zh_Hans: "图片文件的base64编码内容",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      media?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const media = params.media?.trim()
    if (!media) {
      throw new Error("media is required.")
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

    const data = await wechatWorkPostJson<UploadDocumentImageResponse>(
      "/cgi-bin/wedoc/image_upload",
      token,
      { media },
    )
    return {
      url: data.url ?? "",
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
