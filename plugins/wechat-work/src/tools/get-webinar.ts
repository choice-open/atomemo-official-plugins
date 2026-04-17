import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getWebinarSkill from "./get-webinar-skill.md" with { type: "text" }

type GetWebinarResponse = {
  errcode?: number
  errmsg?: string
  webinar_info?: {
    webinar_id: string
    subject: string
    description: string
    start_time: number
    end_time: number
    cover_pic_media_id: string
    password: string
    max_participants: number
    status: number
  }
}

export const getWebinarTool: ToolDefinition = {
  name: "wechat-work-get-webinar",
  display_name: {
    en_US: "Get webinar",
    zh_Hans: "获取研讨会详情",
  },
  description: {
    en_US: "Get details of a webinar.",
    zh_Hans: "获取网络研讨会详情。",
  },
  skill: getWebinarSkill,
  icon: "🔍",
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
      name: "webinar_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Webinar ID",
        zh_Hans: "研讨会ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar ID to get details",
          zh_Hans: "要获取详情的研讨会ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      webinar_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const webinarId = params.webinar_id?.trim()
    if (!webinarId) {
      throw new Error("webinar_id is required.")
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

    const data = await wechatWorkGetJson<GetWebinarResponse>(
      "/webinar/get",
      token,
      { webinar_id: webinarId },
    )
    return { webinar_info: data.webinar_info }
  },
}
