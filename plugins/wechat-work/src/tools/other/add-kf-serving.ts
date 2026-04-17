import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addKfServingSkill from "./add-kf-serving-skill.md" with { type: "text" }

type AddKfServingResponse = {
  errcode?: number
  errmsg?: string
}

export const addKfServingTool: ToolDefinition = {
  name: "wechat-work-add-kf-serving",
  display_name: {
    en_US: "Add customer service representative",
    zh_Hans: "添加接待人员",
  },
  description: {
    en_US: "Add a customer service representative to an account.",
    zh_Hans: "添加客服接待人员到指定账号。",
  },
  skill: addKfServingSkill,
  icon: "👤",
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
    {
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "用户ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "User ID to add as representative",
          zh_Hans: "要添加为接待人员的用户ID",
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
      userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const accountId = params.account_id?.trim()
    if (!accountId) {
      throw new Error("account_id is required.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("userid is required.")
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

    await wechatWorkPostJson<AddKfServingResponse>(
      "/kf/serving/add",
      token,
      { account_id: accountId, userid },
    )
    return { success: true, account_id: accountId, userid }
  },
}
