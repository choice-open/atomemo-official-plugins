import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import checkMsgauditSkill from "./check-msgaudit-skill.md" with { type: "text" }

type CheckMsgauditResponse = {
  errcode?: number
  errmsg?: string
  audit_status?: number
}

export const checkMsgauditTool: ToolDefinition = {
  name: "wechat-work-check-msgaudit",
  display_name: {
    en_US: "Check message audit (enable)",
    zh_Hans: "开通会话存档",
  },
  description: {
    en_US: "Enable message audit (conversation archiving) for WeChat Work.",
    zh_Hans: "开通企业微信会话存档功能。",
  },
  skill: checkMsgauditSkill,
  icon: "🔒",
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The member's userid to enable audit for",
          zh_Hans: "要开通存档的成员 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("User ID is required.")
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

    const data = await wechatWorkPostJson<CheckMsgauditResponse>(
      "/msgaudit/check",
      token,
      { userid },
    )
    const result: {
      audit_status?: number
      message?: string
    } = {}
    if (data.audit_status !== undefined) result.audit_status = data.audit_status
    if (data.errmsg) result.message = data.errmsg
    return result
  },
}