import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getKfAccountSkill from "./get-kf-account-skill.md" with { type: "text" }

type GetKfAccountResponse = {
  errcode?: number
  errmsg?: string
  account_id?: string
  name?: string
  avatar?: string
  status?: number
  wx?: string
}

export const getKfAccountTool: ToolDefinition = {
  name: "wechat-work-get-kf-account",
  display_name: {
    en_US: "Get customer service account details",
    zh_Hans: "获取客服账号详情",
  },
  description: {
    en_US: "Get details of a customer service (KF) account.",
    zh_Hans: "获取指定客服账号的详细信息。",
  },
  skill: getKfAccountSkill,
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
    {
      name: "account_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Account ID",
        zh_Hans: "客服账号ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer service account ID",
          zh_Hans: "客服账号ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      account_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const accountId = params.account_id?.trim()
    if (!accountId) {
      throw new Error("account_id is required.")
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

    const data = await wechatWorkGetJson<GetKfAccountResponse>(
      "/kf/account/get",
      token,
      { account_id: accountId },
    )
    return {
      account_id: data.account_id ?? "",
      name: data.name ?? "",
      avatar: data.avatar ?? "",
      status: data.status ?? 0,
      wx: data.wx ?? "",
    }
  },
}
