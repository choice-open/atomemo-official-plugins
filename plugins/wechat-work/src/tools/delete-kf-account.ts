import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteKfAccountSkill from "./delete-kf-account-skill.md" with { type: "text" }

type DeleteKfAccountResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteKfAccountTool: ToolDefinition = {
  name: "wechat-work-delete-kf-account",
  display_name: {
    en_US: "Delete customer service account",
    zh_Hans: "删除客服账号",
  },
  description: {
    en_US: "Delete a customer service (KF) account.",
    zh_Hans: "删除指定的客服账号。",
  },
  skill: deleteKfAccountSkill,
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
          en_US: "Customer service account ID to delete",
          zh_Hans: "要删除的客服账号ID",
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

    await wechatWorkPostJson<DeleteKfAccountResponse>(
      "/kf/account/del",
      token,
      { account_id: accountId },
    )
    return { success: true, account_id: accountId }
  },
}
