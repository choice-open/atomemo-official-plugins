import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createCalendarSkill from "./create-calendar-skill.md" with { type: "text" }

type CreateCalendarResponse = {
  errcode?: number
  errmsg?: string
  cal_id?: string
}

type ShareConfig = {
  type?: number
  userid?: string
  partyid?: number
}

export const createCalendarTool: ToolDefinition = {
  name: "wechat-work-create-calendar",
  display_name: {
    en_US: "Create calendar",
    zh_Hans: "创建日历",
  },
  description: {
    en_US: "Create a new calendar in WeChat Work.",
    zh_Hans: "在企业微信中创建新日历。",
  },
  skill: createCalendarSkill,
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
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "日历标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Calendar title (max 64 characters)",
          zh_Hans: "日历标题，最多64个字符",
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
          en_US: "Calendar color (0-10, default: 0)",
          zh_Hans: "日历颜色，取值0-10，默认0",
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
          en_US: "Calendar description (max 255 characters)",
          zh_Hans: "日历描述，最多255个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "shares",
      type: "string",
      display_name: {
        en_US: "Shares (JSON array)",
        zh_Hans: "共享配置 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: 'JSON array of share configs: [{"type":1,"userid":"user1"}]',
          zh_Hans: '共享配置的JSON数组：[{"type":1,"userid":"user1"}]',
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      title?: string
      color?: string
      description?: string
      shares?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const title = params.title?.trim()
    if (!title) {
      throw new Error("title is required.")
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

    const calendar: Record<string, unknown> = {
      title: title.slice(0, 64),
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

    if (params.shares?.trim()) {
      try {
        const shares = JSON.parse(params.shares.trim())
        if (Array.isArray(shares)) {
          calendar.shares = shares
        }
      } catch {
        throw new Error("Invalid JSON in shares field")
      }
    }

    const data = await wechatWorkPostJson<CreateCalendarResponse>(
      "/calendar/create",
      token,
      { calendar },
    )
    return { cal_id: data.cal_id ?? null }
  },
}
