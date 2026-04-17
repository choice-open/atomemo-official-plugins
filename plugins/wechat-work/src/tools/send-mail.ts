import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendMailSkill from "./send-mail-skill.md" with { type: "text" }

type SendMailResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
}

type MailRecipient = {
  userid?: string
  email?: string
}

type MailToItem = {
  type: number
  userid?: string
  email?: string
}

export const sendMailTool: ToolDefinition = {
  name: "wechat-work-send-mail",
  display_name: {
    en_US: "Send email",
    zh_Hans: "发送邮件",
  },
  description: {
    en_US: "Send an email via WeChat Work email service.",
    zh_Hans: "通过企业微信邮件服务发送邮件。",
  },
  skill: sendMailSkill,
  icon: "📧",
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
      name: "tolist",
      type: "array",
      required: true,
      display_name: {
        en_US: "To recipients",
        zh_Hans: "收件人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Array of {userid: string} or {email: string}",
          zh_Hans: "数组，元素为 {userid: string} 或 {email: string}",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cc",
      type: "array",
      required: false,
      display_name: {
        en_US: "CC recipients",
        zh_Hans: "抄送人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Array of {userid: string} or {email: string}",
          zh_Hans: "数组，元素为 {userid: string} 或 {email: string}",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "bcc",
      type: "array",
      required: false,
      display_name: {
        en_US: "BCC recipients",
        zh_Hans: "密送人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Array of {userid: string} or {email: string}",
          zh_Hans: "数组，元素为 {userid: string} 或 {email: string}",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "subject",
      type: "string",
      required: true,
      display_name: {
        en_US: "Email subject",
        zh_Hans: "邮件主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Email subject",
          zh_Hans: "邮件主题",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content",
      type: "string",
      required: false,
      display_name: {
        en_US: "Email content",
        zh_Hans: "邮件内容",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Email body (plain text or HTML)",
          zh_Hans: "邮件正文，纯文本或HTML",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "ishtml",
      type: "string",
      required: false,
      display_name: {
        en_US: "Is HTML content",
        zh_Hans: "是否HTML内容",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether content is HTML (1=yes, 0=no)",
          zh_Hans: "内容是否为HTML格式 (1=是, 0=否)",
        },
        options: [
          { label: { en_US: "Yes", zh_Hans: "是" }, value: "1" },
          { label: { en_US: "No", zh_Hans: "否" }, value: "0" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "attachments",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attachments (JSON array)",
        zh_Hans: "附件 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: 'JSON array of attachments: [{"media_id": "xxx", "filename": "file.pdf"}]',
          zh_Hans: '附件JSON数组：[{"media_id": "xxx", "filename": "file.pdf"}]',
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tolist?: MailRecipient[]
      cc?: MailRecipient[]
      bcc?: MailRecipient[]
      subject?: string
      content?: string
      ishtml?: string
      attachments?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const tolist = params.tolist
    if (!tolist || !Array.isArray(tolist) || tolist.length === 0) {
      throw new Error("At least one recipient in 'tolist' is required.")
    }

    const subject = params.subject?.trim()
    if (!subject) {
      throw new Error("subject is required.")
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

    const body: Record<string, unknown> = {
      tolist: tolist.map((r) => ({ type: 1, ...r })),
      subject,
    }

    const content = params.content?.trim()
    if (content) body.content = content

    const ishtml = params.ishtml?.trim()
    if (ishtml) body.ishtml = parseInt(ishtml, 10)

    const attachments = params.attachments?.trim()
    if (attachments) {
      try {
        const parsed = JSON.parse(attachments)
        if (Array.isArray(parsed)) body.attachments = parsed
      } catch {
        throw new Error("Invalid JSON in attachments field")
      }
    }

    if (params.cc && Array.isArray(params.cc) && params.cc.length > 0) {
      body.cc = params.cc.map((r) => ({ type: 1, ...r }))
    }

    if (params.bcc && Array.isArray(params.bcc) && params.bcc.length > 0) {
      body.bcc = params.bcc.map((r) => ({ type: 1, ...r }))
    }



    const data = await wechatWorkPostJson<SendMailResponse>("/mail/send", token, body)
    return {
      msgid: data.msgid ?? "",
    }
  },
}