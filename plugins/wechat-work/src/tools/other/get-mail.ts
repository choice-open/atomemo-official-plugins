import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getMailSkill from "./get-mail-skill.md" with { type: "text" }

type GetMailResponse = {
  errcode?: number
  errmsg?: string
  mail?: {
    mailid: string
    from: Array<{ userid: string; email: string; name?: string }>
    to: Array<{ userid: string; email: string; name?: string }>
    cc: Array<{ userid: string; email: string; name?: string }>
    bcc: Array<{ userid: string; email: string; name?: string }>
    title: string
    generate_type: number
    send_time: number
    body: string
    body_type?: number
    is_need_read: number
    read_time?: number
    attachments?: Array<{
      file_name: string
      media_id: string
      file_size: number
    }>
  }
}

export const getMailTool: ToolDefinition = {
  name: "wechat-work-get-mail",
  display_name: {
    en_US: "Get email details",
    zh_Hans: "获取邮件详情",
  },
  description: {
    en_US: "Get the details of a specific email.",
    zh_Hans: "获取指定邮件的详细内容。",
  },
  skill: getMailSkill,
  icon: "📄",
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
      name: "mailid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Mail ID",
        zh_Hans: "邮件ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Mail ID from list",
          zh_Hans: "邮件ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      mailid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const mailId = params.mailid?.trim()
    if (!mailId) {
      throw new Error("mailid is required.")
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

    const data = await wechatWorkGetJson<GetMailResponse>(
      "/mail/get",
      token,
      { mailid: mailId },
    )
    return {
      mail: data.mail,
    }
  },
}