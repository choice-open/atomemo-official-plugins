import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"

type AddMsgTemplateResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
  fail_list?: string[]
}

type Attachment = {
  msgtype: string
  text?: { content: string }
  image?: { media_id?: string; pic_url?: string }
  link?: { title: string; picurl?: string; desc?: string; url: string }
  miniprogram?: { title: string; pic_media_id: string; appid: string; page: string }
  video?: { media_id: string }
  file?: { media_id: string }
}

export const createMassMessageTool: ToolDefinition = {
  name: "wechat-work-create-mass-message",
  display_name: {
    en_US: "Create mass message to customers",
    zh_Hans: "创建企业群发",
  },
  description: {
    en_US: "Create a mass messaging task to send messages to customers or customer groups.",
    zh_Hans: "创建企业群发消息任务，向客户或客户群发送消息。",
  },
  icon: "📤",
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
      name: "chat_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Chat type",
        zh_Hans: "群发任务类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "single: send to customers, group: send to customer groups",
          zh_Hans: "single: 发送给客户，group: 发送给客户群",
        },
        options: [
          { label: { en_US: "Send to customers", zh_Hans: "发送给客户" }, value: "single" },
          { label: { en_US: "Send to customer groups", zh_Hans: "发送给客户群" }, value: "group" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "External user IDs (comma-separated)",
        zh_Hans: "客户externaluserid列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated external user IDs, up to 10,000 customers",
          zh_Hans: "客户externaluserid列表，最多1万个，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "chat_id_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Customer group IDs (comma-separated)",
        zh_Hans: "客户群ID列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated chat IDs, up to 2000 groups",
          zh_Hans: "客户群ID列表，最多2000个，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tag_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Customer tag IDs (comma-separated)",
        zh_Hans: "客户标签ID列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated tag IDs for filtering customers",
          zh_Hans: "客户标签ID列表，用于筛选客户，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sender",
      type: "string",
      required: true,
      display_name: {
        en_US: "Sender userid",
        zh_Hans: "发送成员userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the member who sends the message",
          zh_Hans: "发送企业群发消息的成员userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "allow_select",
      type: "string",
      required: false,
      display_name: {
        en_US: "Allow member to reselect",
        zh_Hans: "允许成员重新选择",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Allow member to reselect customers in the pending list",
          zh_Hans: "是否允许成员在待发送客户列表中重新选择",
        },
        options: [
          { label: { en_US: "Yes", zh_Hans: "是" }, value: "true" },
          { label: { en_US: "No (default)", zh_Hans: "否（默认）" }, value: "false" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content",
      type: "string",
      required: false,
      display_name: {
        en_US: "Text message content",
        zh_Hans: "消息文本内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Text message content, max 4000 bytes",
          zh_Hans: "消息文本内容，最多4000字节",
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
      chat_type?: string
      external_userid?: string
      chat_id_list?: string
      tag_list?: string
      sender?: string
      allow_select?: string
      content?: string
      attachment?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const sender = params.sender?.trim()
    if (!sender) {
      throw new Error("sender is required.")
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

    const body: Record<string, unknown> = { sender }

    const chatType = params.chat_type?.trim()
    if (chatType) body.chat_type = chatType

    const externalUserid = params.external_userid?.trim()
    if (externalUserid) {
      body.external_userid = externalUserid.split(",").map((s) => s.trim()).filter(Boolean)
    }

    const chatIdList = params.chat_id_list?.trim()
    if (chatIdList) {
      body.chat_id_list = chatIdList.split(",").map((s) => s.trim()).filter(Boolean)
    }

    const tagList = params.tag_list?.trim()
    if (tagList) {
      body.tag_filter = {
        group_list: [{
          tag_list: tagList.split(",").map((s) => s.trim()).filter(Boolean),
        }],
      }
    }

    const allowSelect = params.allow_select?.trim()
    if (allowSelect) body.allow_select = allowSelect === "true"

    const content = params.content?.trim()
    if (content) {
      body.text = { content }
    }

    const attachment = params.attachment?.trim()
    if (attachment) {
      try {
        const attachmentObj = JSON.parse(attachment)
        body.attachment = attachmentObj
      } catch {
        throw new Error("attachment must be valid JSON.")
      }
    }

    if (!content && !attachment) {
      throw new Error("At least one of content or attachment is required.")
    }

    const data = await wechatWorkPostJson<AddMsgTemplateResponse>(
      "/externalcontact/add_msg_template",
      token,
      body,
    )

    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      msgid: data.msgid ?? "",
      fail_list: data.fail_list ?? [],
    }
  },
}
