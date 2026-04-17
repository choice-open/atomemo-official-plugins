import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
} from "../wechat-work/client"
import getMediaSkill from "./get-media-skill.md" with { type: "text" }

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

export const getMediaTool: ToolDefinition = {
  name: "wechat-work-get-media",
  display_name: {
    en_US: "Get media file",
    zh_Hans: "获取临时素材",
  },
  description: {
    en_US: "Download a temporary media file from WeChat Work.",
    zh_Hans: "下载企业微信中的临时素材文件。",
  },
  skill: getMediaSkill,
  icon: "📥",
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
      name: "media_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "素材 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID to download",
          zh_Hans: "要下载的素材 media_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      media_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const mediaId = params.media_id?.trim()
    if (!mediaId) {
      throw new Error("media_id is required.")
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

    const url = new URL(`${QYAPI_BASE}/media/get`)
    url.searchParams.set("access_token", token)
    url.searchParams.set("media_id", mediaId)

    const response = await fetch(url)
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const errorData = await response.json() as {
        errcode?: number
        errmsg?: string
      }
      throw new Error(
        errorData.errmsg ?? `Failed to get media (errcode=${String(errorData.errcode)})`,
      )
    }

    if (contentType.includes("image/")) {
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      const ext = contentType.split("/")[1]?.split(";")[0] || "png"
      return {
        content_type: contentType,
        data: `data:${contentType};base64,${base64}`,
        filename: `media.${ext}`,
      }
    }

    if (contentType.includes("audio/") || contentType.includes("video/")) {
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      return {
        content_type: contentType,
        data: base64,
        filename: `media.${contentType.split("/")[1] || "bin"}`,
      }
    }

    if (contentType.includes("text/") || contentType.includes("application/")) {
      const text = await response.text()
      return {
        content_type: contentType,
        data: text,
      }
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return {
      content_type: contentType,
      data: base64,
      size: buffer.byteLength,
    }
  },
}
