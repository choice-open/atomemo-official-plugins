import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listMeetingsSkill from "./list-meetings-skill.md" with { type: "text" }

type ListMeetingResponse = {
  errcode?: number
  errmsg?: string
  meeting_list?: Array<{
    meeting_id: string
    topic: string
    start_time: number
    end_time: number
    meeting_type: number
    status: number
    invitees: Array<{ userid: string }>
  }>
}

export const listMeetingsTool: ToolDefinition = {
  name: "wechat-work-list-meetings",
  display_name: {
    en_US: "List meetings",
    zh_Hans: "获取会议列表",
  },
  description: {
    en_US: "Get the list of meetings in WeChat Work.",
    zh_Hans: "获取企业微信中的会议列表。",
  },
  skill: listMeetingsSkill,
  icon: "🗓️",
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
      name: "meeting_start_from",
      type: "string",
      required: false,
      display_name: {
        en_US: "Start time from (Unix timestamp)",
        zh_Hans: "开始时间范围起 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting start time range from (Unix timestamp)",
          zh_Hans: "会议开始时间范围起点（Unix时间戳）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "meeting_start_to",
      type: "string",
      required: false,
      display_name: {
        en_US: "Start time to (Unix timestamp)",
        zh_Hans: "开始时间范围止 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting start time range to (Unix timestamp)",
          zh_Hans: "会议开始时间范围终点（Unix时间戳）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "限制数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of results (default: 20)",
          zh_Hans: "返回数量，默认20",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      meeting_start_from?: string
      meeting_start_to?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const body: Record<string, unknown> = {}

    const startFrom = params.meeting_start_from?.trim()
    if (startFrom) {
      const ts = parseInt(startFrom, 10)
      if (!Number.isNaN(ts)) body.meeting_start_from = ts
    }

    const startTo = params.meeting_start_to?.trim()
    if (startTo) {
      const ts = parseInt(startTo, 10)
      if (!Number.isNaN(ts)) body.meeting_start_to = ts
    }

    const limit = params.limit?.trim()
    if (limit) {
      const l = parseInt(limit, 10)
      if (!Number.isNaN(l)) body.limit = l
    } else {
      body.limit = 20
    }

    const data = await wechatWorkPostJson<ListMeetingResponse>(
      "/meeting/list",
      token,
      body,
    )
    return { meeting_list: data.meeting_list ?? [] }
  },
}
