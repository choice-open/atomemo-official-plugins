import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../wechat-work/client"
import uploadMediaSkill from "./upload-media-skill.md" with { type: "text" }

type UploadMediaResponse = {
  errcode?: number
  errmsg?: string
  media_id?: string
  created_at?: number
}

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

const MEDIA_SIZE_LIMITS: Record<string, number> = {
  image: 10 * 1024 * 1024,
  voice: 2 * 1024 * 1024,
  video: 10 * 1024 * 1024,
  file: 20 * 1024 * 1024,
}

export const uploadMediaTool: ToolDefinition = {
  name: "wechat-work-upload-media",
  display_name: {
    en_US: "Upload media",
    zh_Hans: "上传临时素材",
  },
  description: {
    en_US: "Upload temporary media (image, voice, video, file) to WeChat Work.",
    zh_Hans: "上传临时素材到企业微信。",
  },
  skill: uploadMediaSkill,
  icon: "📤",
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
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media type",
        zh_Hans: "媒体类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Media type: image (10MB, JPG/PNG), voice (2MB, AMR), video (10MB, MP4), file (20MB)",
          zh_Hans: "媒体类型：图片(10MB,JPG/PNG)、语音(2MB,AMR)、视频(10MB,MP4)、文件(20MB)",
        },
        options: [
          { label: { en_US: "Image (10MB, JPG/PNG)", zh_Hans: "图片(10MB,JPG/PNG)" }, value: "image" },
          { label: { en_US: "Voice (2MB, AMR)", zh_Hans: "语音(2MB,AMR)" }, value: "voice" },
          { label: { en_US: "Video (10MB, MP4)", zh_Hans: "视频(10MB,MP4)" }, value: "video" },
          { label: { en_US: "File (20MB)", zh_Hans: "文件(20MB)" }, value: "file" },
        ],
        support_expression: true,
        width: "full",
      },
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
          en_US: "Original filename with extension",
          zh_Hans: "原始文件名（含扩展名）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      file_url?: string
      filename?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const type = params.type?.trim()
    const fileUrl = params.file_url?.trim()
    const filename = params.filename?.trim()
    if (!type || !fileUrl || !filename) {
      throw new Error("type, file_url and filename are required.")
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

    const sizeLimit = MEDIA_SIZE_LIMITS[type]
    if (sizeLimit && blob.size > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024)
      throw new Error(`File size exceeds limit for type "${type}". Max size: ${limitMB}MB`)
    }
    if (blob.size < 5) {
      throw new Error("File size must be at least 5 bytes")
    }

    const formData = new FormData()
    formData.append("media", new File([blob], filename))
    formData.append("type", type)

    const url = new URL(`${QYAPI_BASE}/media/upload`)
    url.searchParams.set("access_token", token)

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })

    const data = (await uploadResponse.json()) as UploadMediaResponse
    if (data.errcode !== 0 && data.errcode !== undefined) {
      throw new Error(
        data.errmsg ?? `Upload failed (errcode=${String(data.errcode)})`,
      )
    }

    return {
      media_id: data.media_id ?? "",
      created_at: data.created_at ?? 0,
    }
  },
}
