import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import remindMassMessageSkill from "./remind-mass-message-skill.md" with { type: "text" }

type RemindMassMessageResponse = {
  errcode?: number
  errmsg?: string
}

export const remindMassMessageTool: ToolDefinition = {
  name: "wechat-work-remind-mass-message",
  display_name: {
    en_US: "Remind mass message",
    zh_Hans: "提醒成员群发",
  },
  description: {
    en_US: "Remind members to complete their mass messaging tasks.",
    zh_Hans: "提醒成员完成群发任务。",
  },
  skill: remindMassMessageSkill,
  icon: "🔔",
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
        zh_Hans: "群发消息的id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The mass message ID returned when creating the message",
          zh_Hans: "群发消息的id",
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
      throw new Error("请选择企业微信凭证。")
    }

    const msgid = params.msgid?.trim()
    if (!msgid) {
      throw new Error("msgid 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkPostJson<RemindMassMessageResponse>(
      "/externalcontact/remind_groupmsg_send",
      token,
      { msgid },
    )

    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
