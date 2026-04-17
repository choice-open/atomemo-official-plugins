import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteCalendarSkill from "./delete-calendar-skill.md" with { type: "text" }

type DeleteCalendarResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteCalendarTool: ToolDefinition = {
  name: "wechat-work-delete-calendar",
  display_name: {
    en_US: "Delete calendar",
    zh_Hans: "删除日历",
  },
  description: {
    en_US: "Delete an existing calendar in WeChat Work.",
    zh_Hans: "删除企业微信中现有的日历。",
  },
  skill: deleteCalendarSkill,
  icon: "🗑️",
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
          en_US: "The calendar ID to delete",
          zh_Hans: "要删除的日历ID",
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
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const calId = params.cal_id?.trim()
    if (!calId) {
      throw new Error("cal_id is required.")
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

    const data = await wechatWorkPostJson<DeleteCalendarResponse>(
      "/calendar/delete",
      token,
      { cal_id: calId },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
