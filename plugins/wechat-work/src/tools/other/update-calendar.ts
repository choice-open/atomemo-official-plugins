import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateCalendarSkill from "./update-calendar-skill.md" with { type: "text" }

type UpdateCalendarResponse = {
  errcode?: number
  errmsg?: string
}

export const updateCalendarTool: ToolDefinition = {
  name: "wechat-work-update-calendar",
  display_name: {
    en_US: "Update calendar",
    zh_Hans: "更新日历",
  },
  description: {
    en_US: "Update an existing calendar in WeChat Work.",
    zh_Hans: "更新企业微信中现有的日历。",
  },
  skill: updateCalendarSkill,
  icon: "✏️",
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
          en_US: "The calendar ID to update",
          zh_Hans: "要更新的日历ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      display_name: {
        en_US: "Title",
        zh_Hans: "日历标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New calendar title (max 64 characters)",
          zh_Hans: "新日历标题，最多64个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "color",
      type: "string",
      display_name: {
        en_US: "Color",
        zh_Hans: "日历颜色",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New calendar color (0-10)",
          zh_Hans: "新日历颜色，取值0-10",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      display_name: {
        en_US: "Description",
        zh_Hans: "日历描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "New calendar description (max 255 characters)",
          zh_Hans: "新日历描述，最多255个字符",
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
      title?: string
      color?: string
      description?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const calId = params.cal_id?.trim()
    if (!calId) {
      throw new Error("cal_id is required.")
    }
    if (!params.title?.trim() && !params.color?.trim() && !params.description?.trim()) {
      throw new Error("At least one of title, color, or description is required.")
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

    const calendar: Record<string, unknown> = { cal_id: calId }

    if (params.title?.trim()) {
      calendar.title = params.title.trim().slice(0, 64)
    }

    if (params.color?.trim()) {
      const color = parseInt(params.color.trim(), 10)
      if (!Number.isNaN(color)) {
        calendar.color = Math.min(Math.max(color, 0), 10)
      }
    }

    if (params.description?.trim()) {
      calendar.description = params.description.trim().slice(0, 255)
    }

    const data = await wechatWorkPostJson<UpdateCalendarResponse>(
      "/calendar/update",
      token,
      { calendar },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
