import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getMeetingStatisticSkill from "./get-meeting-statistic-skill.md" with { type: "text" }

type GetMeetingStatisticResponse = {
  errcode?: number
  errmsg?: string
  meeting_id?: string
  total?: number
  participant_stats?: Array<{
    userid: string
    join_time: number
    left_time: number
    duration: number
  }>
}

export const getMeetingStatisticTool: ToolDefinition = {
  name: "wechat-work-get-meeting-statistic",
  display_name: {
    en_US: "Get meeting statistic",
    zh_Hans: "获取会议统计",
  },
  description: {
    en_US: "Get meeting statistics including participant details.",
    zh_Hans: "获取会议统计数据，包括参会成员详情。",
  },
  skill: getMeetingStatisticSkill,
  icon: "📊",
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
      name: "meeting_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Meeting ID",
        zh_Hans: "会议ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting ID to get statistics for",
          zh_Hans: "要获取统计数据的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      meeting_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const meetingId = params.meeting_id?.trim()
    if (!meetingId) {
      throw new Error("meeting_id is required.")
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

    const body: Record<string, unknown> = { meeting_id: meetingId }

    const data = await wechatWorkPostJson<GetMeetingStatisticResponse>(
      "/meeting/statistic/get",
      token,
      body,
    )
    return {
      meeting_id: data.meeting_id ?? "",
      total: data.total ?? 0,
      participant_stats: data.participant_stats ?? [],
    }
  },
}
