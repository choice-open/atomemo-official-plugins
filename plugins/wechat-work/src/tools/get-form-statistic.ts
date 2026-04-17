import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getFormStatisticSkill from "./get-form-statistic-skill.md" with { type: "text" }

type GetFormStatisticResponse = {
  errcode?: number
  errmsg?: string
  stat?: {
    view_count?: number
    submit_count?: number
    answer_rate?: number
  }
}

export const getFormStatisticTool: ToolDefinition = {
  name: "wechat-work-get-form-statistic",
  display_name: {
    en_US: "Get form statistics",
    zh_Hans: "收集表统计信息查询",
  },
  description: {
    en_US: "Get submission statistics for a WeChat Work form.",
    zh_Hans: "获取企业微信收集表的提交统计信息。",
  },
  skill: getFormStatisticSkill,
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
      name: "formid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Form ID",
        zh_Hans: "收集表 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The form ID",
          zh_Hans: "收集表 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      formid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const formid = params.formid?.trim()
    if (!formid) {
      throw new Error("Form ID is required.")
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

    const data = await wechatWorkPostJson<GetFormStatisticResponse>(
      "/cgi-bin/wedoc/get_form_statistic",
      token,
      { formid },
    )
    return {
      stat: data.stat ?? {},
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
