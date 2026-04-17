import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getCheckinRuleSkill from "./get-checkin-rule-skill.md" with { type: "text" }

type CheckinRuleResponse = {
  errcode?: number
  errmsg?: string
  group?: {
    groupid?: number
    groupname?: string
    rule?: Array<{
      type?: number
      timezones?: Array<{
        timezone?: number[]
        times?: string[]
      }>
      workday_type?: number
      allow_flex?: number
      flex_time?: number
      limit_time?: number
      offline_sign?: number
      swiped_card_type?: number
      is_holiday?: number
      is_rest?: number
    }>
    spe_workdays?: Array<{
      date?: string
      type?: number
    }>
    holiday_range?: string[]
  }
}

export const getCheckinRuleTool: ToolDefinition = {
  name: "wechat-work-get-checkin-rule",
  display_name: {
    en_US: "Get checkin rule",
    zh_Hans: "获取打卡规则",
  },
  description: {
    en_US: "Get checkin rule for a specific date.",
    zh_Hans: "获取指定日期的打卡规则。",
  },
  skill: getCheckinRuleSkill,
  icon: "📋",
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
      name: "datetime",
      type: "string",
      required: true,
      display_name: {
        en_US: "Date",
        zh_Hans: "日期",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Date in YYYY-MM-DD format",
          zh_Hans: "日期，格式为 YYYY-MM-DD",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      datetime?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const datetime = params.datetime?.trim()
    if (!datetime) {
      throw new Error("Date is required.")
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

    const data = await wechatWorkGetJson<CheckinRuleResponse>(
      "/checkin/get_checkin_rule",
      token,
      { datetime },
    )

    return data
  },
}