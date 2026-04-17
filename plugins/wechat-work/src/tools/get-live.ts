import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getLiveSkill from "./get-live-skill.md" with { type: "text" }

type GetLiveResponse = {
  errcode?: number
  errmsg?: string
  live_id?: string
  title?: string
  description?: string
  start_time?: number
  end_time?: number
  anchor_userid?: string
  anchor_name?: string
  anchor_qrcode?: string
  topic?: string
  cover_url?: string
  share_url?: string
  status?: number
}

export const getLiveTool: ToolDefinition = {
  name: "wechat-work-get-live",
  display_name: {
    en_US: "Get live details",
    zh_Hans: "获取直播详情",
  },
  description: {
    en_US: "Get live broadcast details by live ID.",
    zh_Hans: "根据直播ID获取直播详情。",
  },
  skill: getLiveSkill,
  icon: "🎥",
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
      name: "live_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Live ID",
        zh_Hans: "直播 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Live broadcast ID",
          zh_Hans: "直播 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      live_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const live_id = params.live_id?.trim()
    if (!live_id) {
      throw new Error("Live ID is required.")
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

    const data = await wechatWorkGetJson<GetLiveResponse>(
      "/live/get",
      token,
      { live_id },
    )

    const result: {
      errcode?: number
      errmsg?: string
      live_id?: string
      title?: string
      description?: string
      start_time?: number
      end_time?: number
      anchor_userid?: string
      anchor_name?: string
      anchor_qrcode?: string
      topic?: string
      cover_url?: string
      share_url?: string
      status?: number
    } = { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }

    if (data.live_id !== undefined) result.live_id = data.live_id
    if (data.title !== undefined) result.title = data.title
    if (data.description !== undefined) result.description = data.description
    if (data.start_time !== undefined) result.start_time = data.start_time
    if (data.end_time !== undefined) result.end_time = data.end_time
    if (data.anchor_userid !== undefined) result.anchor_userid = data.anchor_userid
    if (data.anchor_name !== undefined) result.anchor_name = data.anchor_name
    if (data.anchor_qrcode !== undefined) result.anchor_qrcode = data.anchor_qrcode
    if (data.topic !== undefined) result.topic = data.topic
    if (data.cover_url !== undefined) result.cover_url = data.cover_url
    if (data.share_url !== undefined) result.share_url = data.share_url
    if (data.status !== undefined) result.status = data.status

    return result
  },
}