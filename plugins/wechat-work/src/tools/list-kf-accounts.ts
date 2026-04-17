import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listKfAccountsSkill from "./list-kf-accounts-skill.md" with { type: "text" }

type ListKfAccountsResponse = {
  errcode?: number
  errmsg?: string
  account_list?: Array<{
    account_id: string
    name: string
    avatar: string
    status: number
  }>
}

export const listKfAccountsTool: ToolDefinition = {
  name: "wechat-work-list-kf-accounts",
  display_name: {
    en_US: "List customer service accounts",
    zh_Hans: "获取客服账号列表",
  },
  description: {
    en_US: "List all customer service (KF) accounts.",
    zh_Hans: "获取所有客服账号列表。",
  },
  skill: listKfAccountsSkill,
  icon: "🎧",
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

    const data = await wechatWorkGetJson<ListKfAccountsResponse>(
      "/kf/account/list",
      token,
    )
    return { accounts: data.account_list ?? [] }
  },
}
