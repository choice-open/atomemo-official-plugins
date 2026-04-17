import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import opengidToChatidSkill from "./opengid-to-chatid-skill.md" with { type: "text" }

type OpenidToChatidResponse = {
  errcode?: number
  errmsg?: string
  chat_id?: string
}

export const opengidToChatidTool: ToolDefinition = {
  name: "wechat-work-opengid-to-chatid",
  display_name: {
    en_US: "Convert openid to chatid",
    zh_Hans: "客户群opengid转换",
  },
  description: {
    en_US: "Convert WeChat openid to customer group chatid.",
    zh_Hans: "将微信原生群聊的openid转换为企业微信客户群chat_id。",
  },
  skill: opengidToChatidSkill,
  icon: "🔄",
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
      name: "opengid",
      type: "string",
      required: true,
      display_name: {
        en_US: "OpenID",
        zh_Hans: "客户群 OpenID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "OpenID of the customer group chat from WeChat",
          zh_Hans: "微信原生群聊的 openid",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      opengid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const opengid = params.opengid?.trim()
    if (!opengid) {
      throw new Error("opengid is required.")
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

    const data = await wechatWorkPostJson<OpenidToChatidResponse>(
      "/externalcontact/groupchat/opengid_to_chatid",
      token,
      { opengid },
    )
    return { chat_id: data.chat_id ?? "" }
  },
}