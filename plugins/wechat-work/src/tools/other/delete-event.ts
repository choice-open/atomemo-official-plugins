import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteEventSkill from "./delete-event-skill.md" with { type: "text" }

type DeleteEventResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteEventTool: ToolDefinition = {
  name: "wechat-work-delete-event",
  display_name: {
    en_US: "Delete calendar event",
    zh_Hans: "删除日程",
  },
  description: {
    en_US: "Delete an event from a WeChat Work calendar.",
    zh_Hans: "删除企业微信日历中的日程。",
  },
  skill: deleteEventSkill,
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
          en_US: "Event ID to delete",
          zh_Hans: "要删除的日程ID",
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

    const body: Record<string, unknown> = {
      calendar_id: calId,
      event_id: eventId,
    }

    await wechatWorkPostJson<DeleteEventResponse>(
      "/calendar/delete",
      token,
      body,
    )
    return { success: true }
  },
}