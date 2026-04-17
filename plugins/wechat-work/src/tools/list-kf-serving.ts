import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listKfServingSkill from "./list-kf-serving-skill.md" with { type: "text" }

type ListKfServingResponse = {
  errcode?: number
  errmsg?: string
  servant_list?: Array<{
    userid: string
    status: number
  }>
}

export const listKfServingTool: ToolDefinition = {
  name: "wechat-work-list-kf-serving",
  display_name: {
    en_US: "List customer service representatives",
    zh_Hans: "获取接待人员列表",
  },
  description: {
    en_US: "List all customer service representatives for an account.",
    zh_Hans: "获取指定客服账号的接待人员列表。",
  },
  skill: listKfServingSkill,
  icon: "👥",
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

    const data = await wechatWorkGetJson<ListKfServingResponse>(
      "/kf/serving/list",
      token,
      { account_id: accountId },
    )
    return { servants: data.servant_list ?? [] }
  },
}
