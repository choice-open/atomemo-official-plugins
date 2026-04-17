import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendKfMessageSkill from "./send-kf-message-skill.md" with { type: "text" }

type SendKfMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
}

export const sendKfMessageTool: ToolDefinition = {
  name: "wechat-work-send-kf-message",
  display_name: {
    en_US: "Send customer service message",
    zh_Hans: "发送客服消息",
  },
  description: {
    en_US: "Send a message via customer service (KF).",
    zh_Hans: "通过微信客服发送消息。",
  },
  skill: sendKfMessageSkill,
  icon: "💬",
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
      name: "open_kfid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer service account ID",
        zh_Hans: "客服账号ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer service account ID (open_kfid)",
          zh_Hans: "客服账号ID (open_kfid)",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer user ID",
        zh_Hans: "客户 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "External user ID of the customer",
          zh_Hans: "客户的外部用户userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "msgtype",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message type",
        zh_Hans: "消息类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Message type",
          zh_Hans: "消息类型",
        },
        options: [
          { label: "Text", value: "text" },
          { label: "Image", value: "image" },
          { label: "Voice", value: "voice" },
          { label: "Video", value: "video" },
          { label: "File", value: "file" },
          { label: "Link", value: "link" },
          { label: "Miniprogram", value: "miniprogram" },
          { label: "Msgmenu", value: "msgmenu" },
          { label: "Location", value: "location" },
          { label: "Ca Link", value: "ca_link" },
        ],
      },
    },
    {
      name: "msgid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Message ID",
        zh_Hans: "消息ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Specified message ID (optional, max 32 bytes)",
          zh_Hans: "指定消息ID（可选，最多32字节）",
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
        en_US: "Content",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Message content (text: string, others: JSON)",
          zh_Hans: "消息内容（文本直接填，其他类型填JSON）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      open_kfid?: string
      external_userid?: string
      msgtype?: string
      msgid?: string
      content?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const openKfid = params.open_kfid?.trim()
    if (!openKfid) {
      throw new Error("open_kfid is required.")
    }

    const externalUserid = params.external_userid?.trim()
    if (!externalUserid) {
      throw new Error("external_userid is required.")
    }

    const msgtype = params.msgtype?.trim()
    if (!msgtype) {
      throw new Error("msgtype is required.")
    }

    const content = params.content?.trim()

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
      open_kfid: openKfid,
      touser: externalUserid,
    }

    const msgid = params.msgid?.trim()
    if (msgid) body.msgid = msgid

    if (msgtype === "text") {
      if (!content) {
        throw new Error("content is required for text messages.")
      }
      body.msgtype = "text"
      body.text = { content }
    } else if (msgtype === "msgmenu") {
      if (!content) {
        throw new Error("content is required for msgmenu messages.")
      }
      body.msgtype = "msgmenu"
      try {
        body.msgmenu = JSON.parse(content)
      } catch {
        throw new Error("msgmenu content must be valid JSON.")
      }
    } else {
      if (!content) {
        throw new Error("content is required for this message type.")
      }
      try {
        const contentObj = JSON.parse(content)
        body.msgtype = msgtype
        body[msgtype] = contentObj
      } catch {
        throw new Error("For non-text messages, content must be valid JSON.")
      }
    }

    const data = await wechatWorkPostJson<SendKfMessageResponse>(
      "/kf/send_msg",
      token,
      body,
    )
    return { msgid: data.msgid ?? "" }
  },
}