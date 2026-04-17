import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
} from "../../wechat-work/client"
import getMediaSkill from "./get-media-skill.md" with { type: "text" }

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

export const getMediaTool: ToolDefinition = {
  name: "wechat-work-get-media",
  display_name: {
    en_US: "Get Temporary Media",
    zh_Hans: "获取临时素材",
  },
  description: {
    en_US: "Download a temporary media file from WeChat Work. The media_id is valid for only 3 days.",
    zh_Hans: "从企业微信获取临时素材文件。media_id有效期只有3天，注意要及时获取以免过期。",
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
        en_US: "WeChat Work Credential",
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
        zh_Hans: "媒体文件ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The media_id obtained from uploading temporary media. Valid for 3 days. Shared across all apps within the enterprise.",
          zh_Hans: "通过上传临时素材或异步上传临时素材获取到的媒体文件ID，3天内有效，media_id在同一企业内所有应用之间可以共享。",
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

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const disposition = response.headers.get("content-disposition") || ""
    const filenameMatch = disposition.match(/filename="?([^";\s]+)"?/)
    const filename = filenameMatch?.[1] ?? `media.${contentType.split("/")[1]?.split(";")[0] || "bin"}`

    return {
      content_type: contentType,
      data: base64,
      filename,
      size: buffer.byteLength,
    }
  },
}
