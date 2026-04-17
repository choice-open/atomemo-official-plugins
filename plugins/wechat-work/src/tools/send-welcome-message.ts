import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"

type SendWelcomeMsgResponse = {
  errcode?: number
  errmsg?: string
}

export const sendWelcomeMessageTool: ToolDefinition = {
  name: "wechat-work-send-welcome-message",
  display_name: {
    en_US: "Send welcome message to new customer",
    zh_Hans: "发送新客户欢迎语",
  },
  description: {
    en_US: "Send a personalized welcome message to newly added customers.",
    zh_Hans: "通过添加了客户的成员向新添加的客户发送个性化的欢迎语。",
  },
  icon: "👋",
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
      name: "welcome_code",
      type: "string",
      required: true,
      display_name: {
        en_US: "Welcome code",
        zh_Hans: "欢迎语凭证",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Welcome code from the add external contact event, valid for 20 seconds",
          zh_Hans: "添加外部联系人事件推送的welcome_code，有效期20秒",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "text",
      type: "string",
      required: false,
      display_name: {
        en_US: "Text message content",
        zh_Hans: "文本消息内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Text message content, max 4000 bytes",
          zh_Hans: "文本消息内容，最多4000字节",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "attachment",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attachment (JSON)",
        zh_Hans: "附件内容 (JSON)",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: 'JSON for attachment: {"msgtype":"image/video/link/miniprogram/file","image/video/link/miniprogram/file":{...}}',
          zh_Hans: '附件的JSON格式，如 {"msgtype":"image","image":{"media_id":"xxx"}}',
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      welcome_code?: string
      text?: string
      attachment?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const welcomeCode = params.welcome_code?.trim()
    if (!welcomeCode) {
      throw new Error("welcome_code is required.")
    }

    const text = params.text?.trim()
    const attachment = params.attachment?.trim()

    if (!text && !attachment) {
      throw new Error("At least one of text or attachment is required.")
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

    const body: Record<string, unknown> = { welcome_code: welcomeCode }

    if (text) {
      body.text = { content: text }
    }

    if (attachment) {
      try {
        const attachmentObj = JSON.parse(attachment)
        body.msgtype = attachmentObj.msgtype
        body[attachmentObj.msgtype] = attachmentObj[attachmentObj.msgtype]
      } catch {
        throw new Error("attachment must be valid JSON.")
      }
    }

    const data = await wechatWorkPostJson<SendWelcomeMsgResponse>(
      "/externalcontact/send_welcome_msg",
      token,
      body,
    )

    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
