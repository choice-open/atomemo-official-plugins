import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../wechat-work/client"
import uploadDocumentMediaSkill from "./upload-document-media-skill.md" with { type: "text" }

type UploadDocumentMediaResponse = {
  errcode?: number
  errmsg?: string
  media_id?: string
  created_at?: number
}

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

const FILE_SIZE_LIMIT = 20 * 1024 * 1024

export const uploadDocumentMediaTool: ToolDefinition = {
  name: "wechat-work-upload-document-media",
  display_name: {
    en_US: "Upload document media",
    zh_Hans: "上传临时素材",
  },
  description: {
    en_US: "Upload temporary media file for use in WeChat Work documents.",
    zh_Hans: "上传临时素材供企业微信文档引用。",
  },
  skill: uploadDocumentMediaSkill,
  icon: "📎",
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
      name: "file_url",
      type: "string",
      required: true,
      display_name: {
        en_US: "File URL",
        zh_Hans: "文件 URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "URL of the file to upload",
          zh_Hans: "要上传文件的 URL",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "filename",
      type: "string",
      required: true,
      display_name: {
        en_US: "Filename",
        zh_Hans: "文件名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Original filename with extension (max 20MB)",
          zh_Hans: "原始文件名（含扩展名，最大20MB）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      file_url?: string
      filename?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const fileUrl = params.file_url?.trim()
    const filename = params.filename?.trim()
    if (!fileUrl || !filename) {
      throw new Error("file_url and filename are required.")
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

    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${response.status}`)
    }
    const blob = await response.blob()

    if (blob.size > FILE_SIZE_LIMIT) {
      throw new Error(`File size exceeds limit. Max size: 20MB`)
    }
    if (blob.size < 5) {
      throw new Error("File size must be at least 5 bytes")
    }

    const formData = new FormData()
    formData.append("media", new File([blob], filename))
    formData.append("type", "file")

    const url = new URL(`${QYAPI_BASE}/media/upload`)
    url.searchParams.set("access_token", token)

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })

    const data = (await uploadResponse.json()) as UploadDocumentMediaResponse
    if (data.errcode !== 0 && data.errcode !== undefined) {
      throw new Error(
        data.errmsg ?? `Upload failed (errcode=${String(data.errcode)})`,
      )
    }

    return {
      media_id: data.media_id ?? "",
      created_at: data.created_at ?? 0,
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
