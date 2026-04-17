import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../../wechat-work/client"
import uploadMediaSkill from "./upload-media-skill.md" with { type: "text" }

type UploadMediaResponse = {
  errcode?: number
  errmsg?: string
  type?: string
  media_id?: string
  created_at?: string
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
    en_US: "Upload Temporary Media",
    zh_Hans: "上传临时素材",
  },
  description: {
    en_US: "Upload temporary media to WeChat Work. The returned media_id is valid for 3 days and can be shared across apps within the enterprise.",
    zh_Hans: "素材上传得到media_id，该media_id仅三天内有效，media_id在同一企业内应用之间可以共享。",
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
        en_US: "WeChat Work Credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media Type",
        zh_Hans: "媒体文件类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Media file type: image (10MB, JPG/PNG), voice (2MB, AMR, ≤60s), video (10MB, MP4), file (20MB)",
          zh_Hans: "媒体文件类型：图片（10MB，支持JPG/PNG）、语音（2MB，播放长度不超过60s，仅支持AMR）、视频（10MB，支持MP4）、普通文件（20MB）",
        },
        options: [
          { label: { en_US: "Image (10MB, JPG/PNG)", zh_Hans: "图片（10MB，JPG/PNG）" }, value: "image" },
          { label: { en_US: "Voice (2MB, AMR, ≤60s)", zh_Hans: "语音（2MB，AMR，≤60s）" }, value: "voice" },
          { label: { en_US: "Video (10MB, MP4)", zh_Hans: "视频（10MB，MP4）" }, value: "video" },
          { label: { en_US: "File (20MB)", zh_Hans: "普通文件（20MB）" }, value: "file" },
        ],
        width: "full",
      },
    },
    {
      name: "media",
      type: "file_ref",
      required: true,
      display_name: {
        en_US: "Media File",
        zh_Hans: "媒体文件",
      },
      ui: {
        hint: {
          en_US: "The media file to upload. All files must be at least 5 bytes. Size limits vary by type.",
          zh_Hans: "要上传的媒体文件，所有文件大小必须大于5个字节，不同类型有不同的大小限制。",
        },
      },
    },
  ],
  async invoke({ args, context }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      media?: unknown
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const type = params.type?.trim()
    if (!type) {
      throw new Error("type is required.")
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
    const sizeLimit = MEDIA_SIZE_LIMITS[type]
    if (sizeLimit && fileSize > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024)
      throw new Error(`File size exceeds limit for type "${type}". Max size: ${limitMB}MB`)
    }
    if (fileSize < 5) {
      throw new Error("File size must be at least 5 bytes")
    }

    const fileContent = Buffer.from(downloaded.content, "base64")
    const filename = downloaded.filename ?? "media"
    const formData = new FormData()
    formData.append(
      "media",
      new File([fileContent], filename, {
        type: downloaded.mime_type ?? "application/octet-stream",
      }),
    )

    const url = new URL(`${QYAPI_BASE}/media/upload`)
    url.searchParams.set("access_token", token)
    url.searchParams.set("type", type)

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
      type: data.type ?? type,
      media_id: data.media_id ?? "",
      created_at: data.created_at ?? "",
    }
  },
}
