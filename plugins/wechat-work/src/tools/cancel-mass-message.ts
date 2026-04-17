import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"

type CancelMassMessageResponse = {
  errcode?: number
  errmsg?: string
}

export const cancelMassMessageTool: ToolDefinition = {
  name: "wechat-work-cancel-mass-message",
  display_name: {
    en_US: "Cancel mass message",
    zh_Hans: "停止企业群发",
  },
  description: {
    en_US: "Cancel a scheduled mass messaging task.",
    zh_Hans: "停止已创建的企业群发任务。",
  },
  icon: "⏹️",
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
        en_US: "Mass message ID",
        zh_Hans: "群发消息ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The mass message ID returned when creating the message",
          zh_Hans: "创建群发消息时返回的msgid",
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

    const data = await wechatWorkPostJson<CancelMassMessageResponse>(
      "/externalcontact/cancel_groupmsg_send",
      token,
      { msgid },
    )

    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
