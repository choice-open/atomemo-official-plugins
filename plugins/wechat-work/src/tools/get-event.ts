import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getEventSkill from "./get-event-skill.md" with { type: "text" }

type GetEventResponse = {
  errcode?: number
  errmsg?: string
  event?: {
    event_id: string
    organizer: { userid: string }
    summary: string
    description?: string
    start_time: number
    end_time: number
    location?: string
    attendees?: Array<{ userid: string }>
    reminders?: { is_remind: number }
  }
}

export const getEventTool: ToolDefinition = {
  name: "wechat-work-get-event",
  display_name: {
    en_US: "Get calendar event",
    zh_Hans: "获取日程详情",
  },
  description: {
    en_US: "Get the details of a calendar event.",
    zh_Hans: "获取企业微信日历中的日程详情。",
  },
  skill: getEventSkill,
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
      name: "cal_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Calendar ID",
        zh_Hans: "日历 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Calendar ID containing the event",
          zh_Hans: "包含日程的日历ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "event_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Event ID",
        zh_Hans: "日程 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Event ID to retrieve",
          zh_Hans: "要获取的日程ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      cal_id?: string
      event_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const calId = params.cal_id?.trim()
    if (!calId) {
      throw new Error("cal_id is required.")
    }

    const eventId = params.event_id?.trim()
    if (!eventId) {
      throw new Error("event_id is required.")
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

    const data = await wechatWorkGetJson<GetEventResponse>(
      "/calendar/get",
      token,
      { calendar_id: calId, event_id: eventId },
    )
    return data.event ?? null
  },
}