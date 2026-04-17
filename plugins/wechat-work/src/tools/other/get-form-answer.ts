import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getFormAnswerSkill from "./get-form-answer-skill.md" with { type: "text" }

type GetFormAnswerResponse = {
  errcode?: number
  errmsg?: string
  total?: number
  answers?: JsonValue[]
}

export const getFormAnswerTool: ToolDefinition = {
  name: "wechat-work-get-form-answer",
  display_name: {
    en_US: "Get form answers",
    zh_Hans: "读取收集表答案",
  },
  description: {
    en_US: "Read answers submitted to a WeChat Work form.",
    zh_Hans: "读取企业微信收集表的提交答案。",
  },
  skill: getFormAnswerSkill,
  icon: "📝",
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
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Maximum records to return (default 100)",
          zh_Hans: "最大返回记录数（默认100）",
        },
        support_expression: true,
        width: "full",
      },
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
          en_US: "Number of records to skip (default 0)",
          zh_Hans: "跳过的记录数（默认0）",
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
      limit?: string
      offset?: string
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

    const requestBody: Record<string, string | number> = {
      formid,
    }

    const limit = params.limit?.trim()
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        requestBody.limit = limitNum
      }
    }

    const offset = params.offset?.trim()
    if (offset) {
      const offsetNum = parseInt(offset, 10)
      if (!isNaN(offsetNum) && offsetNum >= 0) {
        requestBody.offset = offsetNum
      }
    }

    const data = await wechatWorkPostJson<GetFormAnswerResponse>(
      "/cgi-bin/wedoc/get_form_answer",
      token,
      requestBody,
    )
    return {
      total: data.total ?? 0,
      answers: data.answers ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
