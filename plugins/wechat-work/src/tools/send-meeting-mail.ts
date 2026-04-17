import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"

type SendMeetingMailResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
  schedule_id?: string
}

export const sendMeetingMailTool: ToolDefinition = {
  name: "wechat-work-send-meeting-mail",
  display_name: {
    en_US: "Send meeting mail",
    zh_Hans: "发送会议邮件",
  },
  description: {
    en_US: "Send an email with a meeting attached.",
    zh_Hans: "发送包含会议的邮件。",
  },
  icon: "🏢",
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
      name: "to_emails",
      type: "string",
      required: true,
      display_name: {
        en_US: "To (emails)",
        zh_Hans: "收件人邮箱",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated email addresses",
          zh_Hans: "收件人邮箱地址，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "to_userids",
      type: "string",
      required: false,
      display_name: {
        en_US: "To (userids)",
        zh_Hans: "收件人userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated userids (internal members)",
          zh_Hans: "企业内成员的userid，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cc_emails",
      type: "string",
      required: false,
      display_name: {
        en_US: "CC (emails)",
        zh_Hans: "抄送人邮箱",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated email addresses",
          zh_Hans: "抄送人邮箱地址，用逗号分隔",
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
        en_US: "Subject",
        zh_Hans: "邮件主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Email subject (also meeting title)",
          zh_Hans: "邮件主题（也是会议标题）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: {
        en_US: "Content",
        zh_Hans: "邮件正文",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Email body (also meeting description)",
          zh_Hans: "邮件正文（也是会议描述）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间(Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting start time as Unix timestamp",
          zh_Hans: "会议开始时间，Unix时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间(Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting end time as Unix timestamp",
          zh_Hans: "会议结束时间，Unix时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "location",
      type: "string",
      required: false,
      display_name: {
        en_US: "Location",
        zh_Hans: "会议地点",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting location",
          zh_Hans: "会议地点",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "meeting_password",
      type: "string",
      required: false,
      display_name: {
        en_US: "Meeting password",
        zh_Hans: "会议密码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting password (optional)",
          zh_Hans: "会议密码（可选）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "hosts",
      type: "string",
      required: false,
      display_name: {
        en_US: "Meeting hosts (userids)",
        zh_Hans: "会议主持人(userid)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated userids of meeting hosts",
          zh_Hans: "会议主持人的userid，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      to_emails?: string
      to_userids?: string
      cc_emails?: string
      subject?: string
      content?: string
      start_time?: string
      end_time?: string
      location?: string
      meeting_password?: string
      hosts?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const toEmails = params.to_emails?.trim()
    if (!toEmails) {
      throw new Error("to_emails is required.")
    }

    const subject = params.subject?.trim()
    if (!subject) {
      throw new Error("subject is required.")
    }

    const content = params.content?.trim()
    if (!content) {
      throw new Error("content is required.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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
      to: {
        emails: toEmails.split(",").map((s) => s.trim()).filter(Boolean),
      },
      subject,
      content,
      schedule: {
        start_time: parseInt(startTime, 10),
        end_time: parseInt(endTime, 10),
      },
      meeting: {},
    }

    const toUserids = params.to_userids?.trim()
    if (toUserids) {
      body.to.userids = toUserids.split(",").map((s) => s.trim()).filter(Boolean)
    }

    const ccEmails = params.cc_emails?.trim()
    if (ccEmails) {
      body.cc = { emails: ccEmails.split(",").map((s) => s.trim()).filter(Boolean) }
    }

    const location = params.location?.trim()
    if (location) {
      body.schedule.location = location
    }

    const password = params.meeting_password?.trim()
    const hosts = params.hosts?.trim()
    if (password || hosts) {
      body.meeting.option = {}
      if (password) body.meeting.option.password = password
      if (hosts) {
        body.meeting.hosts = {
          userids: hosts.split(",").map((s) => s.trim()).filter(Boolean),
        }
      }
    }

    const data = await wechatWorkPostJson<SendMeetingMailResponse>(
      "/exmail/app/compose_send",
      token,
      body,
    )

    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      msgid: data.msgid ?? "",
      schedule_id: data.schedule_id ?? "",
    }
  },
}
