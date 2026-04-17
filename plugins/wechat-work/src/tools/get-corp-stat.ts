import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getCorpStatSkill from "./get-corp-stat-skill.md" with { type: "text" }

type GetCorpStatResponse = {
  errcode?: number
  errmsg?: string
  data?: Array<{
    stat_time: number
    new_contact_cnt: number
    new_contact_with_trail_cnt: number
    chat_cnt: number
    msg_sent_cnt: number
    active_contact_cnt: number
    active_contact_ratio: number
    quit_contact_cnt: number
    quit_contact_ratio: number
  }>
}

export const getCorpStatTool: ToolDefinition = {
  name: "wechat-work-get-corp-stat",
  display_name: {
    en_US: "Get enterprise customer statistics",
    zh_Hans: "获取企业客户数据",
  },
  description: {
    en_US: "Get enterprise customer statistics by time range.",
    zh_Hans: "按时间范围获取企业客户统计数据。",
  },
  skill: getCorpStatSkill,
  icon: "📈",
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
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time as Unix timestamp",
          zh_Hans: "开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time as Unix timestamp",
          zh_Hans: "结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      start_time?: string
      end_time?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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

    const data = await wechatWorkGetJson<GetCorpStatResponse>(
      "/externalcontact/get_corp_stat",
      token,
      {
        start_time: startTime,
        end_time: endTime,
      },
    )
    return { data: data.data ?? [] }
  },
}