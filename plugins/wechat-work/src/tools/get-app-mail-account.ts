import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getAppMailAccountSkill from "./get-app-mail-account-skill.md" with { type: "text" }

type GetAppMailAccountResponse = {
  errcode?: number
  errmsg?: string
  list?: Array<{
    account: string
    userid?: string
    alias?: string
    name?: string
    organization?: string
    address?: string
  }>
}

export const getAppMailAccountTool: ToolDefinition = {
  name: "wechat-work-get-app-mail-account",
  display_name: {
    en_US: "Get application email account",
    zh_Hans: "获取应用邮箱",
  },
  description: {
    en_US: "Get the application email account associated with the current application.",
    zh_Hans: "获取当前应用绑定的应用邮箱账号。",
  },
  skill: getAppMailAccountSkill,
  icon: "📮",
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const data = await wechatWorkGetJson<GetAppMailAccountResponse>(
      "/mail/get_app_mail_account",
      token,
    )
    return {
      list: data.list ?? [],
    }
  },
}