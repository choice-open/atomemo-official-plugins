import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import revokeMessageSkill from "./revoke-message-skill.md" with { type: "text" }

type RevokeMessageResponse = {
  errcode?: number
  errmsg?: string
}

export const revokeMessageTool: ToolDefinition = {
  name: "wechat-work-revoke-message",
  display_name: {
    en_US: "Revoke message",
    zh_Hans: "撤回应用消息",
  },
  description: {
    en_US: "Recall a previously sent application message.",
    zh_Hans: "撤回已发送的应用消息。",
  },
  skill: revokeMessageSkill,
  icon: "↩️",
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
      name: "msgid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message ID",
        zh_Hans: "消息ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The message ID to revoke (returned when sending)",
          zh_Hans: "要撤回的消息ID（发送消息时返回）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      msgid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const msgid = params.msgid?.trim()
    if (!msgid) {
      throw new Error("msgid is required.")
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

    const data = await wechatWorkPostJson<RevokeMessageResponse>(
      "/message/revoke",
      token,
      { msgid },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
