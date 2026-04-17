import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendCustomerMessageSkill from "./send-customer-message-skill.md" with { type: "text" }

type SendCustomerMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
}

export const sendCustomerMessageTool: ToolDefinition = {
  name: "wechat-work-send-customer-message",
  display_name: {
    en_US: "Send message to customer",
    zh_Hans: "发送消息给客户",
  },
  description: {
    en_US: "Send a message to a customer via the staff who added them.",
    zh_Hans: "通过添加了客户的成员发送消息给客户。",
  },
  skill: sendCustomerMessageSkill,
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Staff userid",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the staff who added the customer",
          zh_Hans: "添加了客户的成员userid",
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
        en_US: "External userid",
        zh_Hans: "外部联系人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer's external userid",
          zh_Hans: "客户的外部联系人userid",
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
          { label: "Link", value: "link" },
          { label: "Miniprogram", value: "miniprogram" },
        ],
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: {
        en_US: "Content",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Message content (text: content, image/link/miniprogram: json)",
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
      userid?: string
      external_userid?: string
      msgtype?: string
      content?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("userid is required.")
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
    if (!content) {
      throw new Error("content is required.")
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
      userid,
      external_userid: externalUserid,
    }

    if (msgtype === "text") {
      body.msgtype = "text"
      body.text = { content }
    } else {
      try {
        const contentObj = JSON.parse(content)
        body.msgtype = msgtype
        body[msgtype] = contentObj
      } catch {
        throw new Error("For non-text messages, content must be valid JSON.")
      }
    }

    const data = await wechatWorkPostJson<SendCustomerMessageResponse>(
      "/externalcontact/message/send",
      token,
      body,
    )
    return { msgid: data.msgid ?? "" }
  },
}