import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getContactWaySkill from "./get-contact-way-skill.md" with { type: "text" }

type GetContactWayResponse = {
  errcode?: number
  errmsg?: string
  contact_way?: {
    config_id: string
    type: number
    scene: number
    question_list?: Array<{ question: string; answer: string }>
    style?: number
    remark?: string
    add_user_tags?: string[]
    contact_type?: number
    contact_user?: string[]
    expire_time?: number
    unionid?: string
  }
}

export const getContactWayTool: ToolDefinition = {
  name: "wechat-work-get-contact-way",
  display_name: {
    en_US: "Get contact way",
    zh_Hans: "获取联系我方式",
  },
  description: {
    en_US: "Get the contact way configuration.",
    zh_Hans: "获取联系我方式的配置详情。",
  },
  skill: getContactWaySkill,
  icon: "📞",
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
      name: "config_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Config ID",
        zh_Hans: "联系方式配置ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Contact way config ID",
          zh_Hans: "联系我方式的 config_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      config_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const configId = params.config_id?.trim()
    if (!configId) {
      throw new Error("config_id is required.")
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

    const data = await wechatWorkGetJson<GetContactWayResponse>(
      "/externalcontact/get_contact_way",
      token,
      { config_id: configId },
    )
    return data.contact_way ?? null
  },
}