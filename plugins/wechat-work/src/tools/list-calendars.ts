import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listCalendarsSkill from "./list-calendars-skill.md" with { type: "text" }

type ListCalendarResponse = {
  errcode?: number
  errmsg?: string
  calendar_list?: Array<{
    cal_id: string
    title: string
    owner: string
    color: number
    permission: number
    description: string
    share_type: number
  }>
}

export const listCalendarsTool: ToolDefinition = {
  name: "wechat-work-list-calendars",
  display_name: {
    en_US: "List calendars",
    zh_Hans: "获取日历列表",
  },
  description: {
    en_US: "Get the list of calendars in WeChat Work.",
    zh_Hans: "获取企业微信中的日历列表。",
  },
  skill: listCalendarsSkill,
  icon: "📅",
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
      name: "offset",
      type: "string",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Offset for pagination (default: 0)",
          zh_Hans: "分页偏移量，默认0",
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
          en_US: "Number of results (default: 500)",
          zh_Hans: "返回数量，默认500",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      offset?: string
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

    const extra: Record<string, string> = {}
    if (params.offset?.trim()) extra.offset = params.offset.trim()
    if (params.limit?.trim()) extra.limit = params.limit.trim()

    const data = await wechatWorkGetJson<ListCalendarResponse>(
      "/calendar/list",
      token,
      Object.keys(extra).length ? extra : undefined,
    )
    return { calendar_list: data.calendar_list ?? [] }
  },
}
