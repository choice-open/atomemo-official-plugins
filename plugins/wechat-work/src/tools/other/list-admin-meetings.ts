import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listAdminMeetingsSkill from "./list-admin-meetings-skill.md" with { type: "text" }

type ListAdminMeetingsResponse = {
  errcode?: number
  errmsg?: string
  meeting_list?: Array<{
    meeting_id: string
    subject: string
    start_time: number
    end_time: number
    organizer_userid: string
  }>
  total_count?: number
}

export const listAdminMeetingsTool: ToolDefinition = {
  name: "wechat-work-list-admin-meetings",
  display_name: {
    en_US: "List admin meetings",
    zh_Hans: "获取管理员会议",
  },
  description: {
    en_US: "Get list of meetings organized by admin.",
    zh_Hans: "获取管理员创建的会议列表。",
  },
  skill: listAdminMeetingsSkill,
  icon: "👑",
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
      name: "organizer_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Organizer user ID",
        zh_Hans: "组织者userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by organizer user ID",
          zh_Hans: "按组织者userid筛选",
        },
        support_expression: true,
        width: "full",
      },
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
      organizer_userid?: string
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

    const extraParams: Record<string, string> = {}

    const organizerUserid = params.organizer_userid?.trim()
    if (organizerUserid) extraParams.organizer_userid = organizerUserid

    const startFrom = params.meeting_start_from?.trim()
    if (startFrom) extraParams.meeting_start_from = startFrom

    const startTo = params.meeting_start_to?.trim()
    if (startTo) extraParams.meeting_start_to = startTo

    const limit = params.limit?.trim()
    if (limit) extraParams.limit = limit

    const data = await wechatWorkGetJson<ListAdminMeetingsResponse>(
      "/meeting/admin_list",
      token,
      extraParams,
    )
    return {
      meeting_list: data.meeting_list ?? [],
      total_count: data.total_count ?? 0,
    }
  },
}
