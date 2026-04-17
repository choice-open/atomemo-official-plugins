import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
} from "../wechat-work/client"
import getJssdkMediaSkill from "./get-jssdk-media-skill.md" with { type: "text" }

export const getJssdkMediaTool: ToolDefinition = {
  name: "wechat-work-get-jssdk-media",
  display_name: {
    en_US: "Get high-def media (JSSDK)",
    zh_Hans: "获取高清语音素材",
  },
  description: {
    en_US: "Get high-definition voice/media from WeChat Work.",
    zh_Hans: "获取企业微信高清语音素材。",
  },
  skill: getJssdkMediaSkill,
  icon: "🎧",
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

    const url = new URL(
      "https://qyapi.weixin.qq.com/cgi-bin/media/get/jssdk",
    )
    url.searchParams.set("access_token", token)
    url.searchParams.set("media_id", mediaId)

    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    const base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    )
    return { media: base64, content_type: res.headers.get("content-type") ?? "audio/amr" }
  },
}