import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getFormInfoSkill from "./get-form-info-skill.md" with { type: "text" }

type GetFormInfoResponse = {
  errcode?: number
  errmsg?: string
  form?: {
    formid?: string
    title?: string
    description?: string
    create_time?: number
    expire_time?: number
    status?: number
    submit_count?: number
  }
}

export const getFormInfoTool: ToolDefinition = {
  name: "wechat-work-get-form-info",
  display_name: {
    en_US: "Get form info",
    zh_Hans: "获取收集表信息",
  },
  description: {
    en_US: "Get configuration information of a WeChat Work form.",
    zh_Hans: "获取企业微信收集表的配置信息。",
  },
  skill: getFormInfoSkill,
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

    const data = await wechatWorkPostJson<GetFormInfoResponse>(
      "/cgi-bin/wedoc/get_form_info",
      token,
      { formid },
    )
    return {
      form: data.form ?? {},
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
