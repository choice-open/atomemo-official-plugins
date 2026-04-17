import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendRobotMessageSkill from "./send-robot-message-skill.md" with {
  type: "text",
}

type SendRobotMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
}

export const sendRobotMessageTool: ToolDefinition = {
  name: "wechat-work-send-robot-message",
  display_name: {
    en_US: "Send intelligent robot message",
    zh_Hans: "发送智能机器人消息",
  },
  description: {
    en_US:
      "Send a message via an intelligent robot (智能机器人) using the robot agent.",
    zh_Hans: "通过智能机器人向用户发送消息。",
  },
  skill: sendRobotMessageSkill,
  icon: "🤖",
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
      name: "robot_agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Robot Agent ID",
        zh_Hans: "机器人 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of the intelligent robot",
          zh_Hans: "智能机器人的 AgentId",
        },
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
        options: [
          { label: "Text (文本)", value: "text" },
          { label: "Markdown", value: "markdown" },
          { label: "Image (图片)", value: "image" },
          { label: "News (图文)", value: "news" },
          { label: "File (文件)", value: "file" },
          { label: "TextCard (文本卡片)", value: "textcard" },
        ],
      },
    },
    {
      name: "msgid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Client message ID",
        zh_Hans: "开发者客户端消息ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Client-side message ID for deduplication",
          zh_Hans: "开发者侧消息ID，用于消息去重",
        },
        width: "full",
      },
    },
    {
      name: "touser",
      type: "string",
      required: false,
      display_name: {
        en_US: "To users (userid)",
        zh_Hans: "接收成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated userids, e.g., zhangsan|lisi",
          zh_Hans: "成员 userid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "toparty",
      type: "string",
      required: false,
      display_name: {
        en_US: "To departments (partyid)",
        zh_Hans: "接收部门 partyid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated partyids, e.g., 1|2",
          zh_Hans: "部门 partyid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "totag",
      type: "string",
      required: false,
      display_name: {
        en_US: "To tags (tagid)",
        zh_Hans: "接收标签 tagid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated tagids, e.g., 1|2",
          zh_Hans: "标签 tagid，多个用 | 分隔",
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
        en_US: "Text content",
        zh_Hans: "文本内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Text message content (required for text type)",
          zh_Hans: "文本消息内容（text类型必填）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "素材 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID (required for image/file/news types)",
          zh_Hans: "素材media_id（image/file/news类型必填）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Title",
        zh_Hans: "标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Message title (for textcard/news)",
          zh_Hans: "消息标题（textcard/news类型使用）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Message description (for textcard/news)",
          zh_Hans: "消息描述（textcard/news类型使用）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Link URL",
        zh_Hans: "跳转链接",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "URL to jump to (for textcard/news)",
          zh_Hans: "点击后跳转的链接（textcard/news类型使用）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      robot_agent_id?: number
      msgtype?: string
      msgid?: string
      touser?: string
      toparty?: string
      totag?: string
      content?: string
      media_id?: string
      title?: string
      description?: string
      url?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const msgtype = params.msgtype?.trim() as string
    if (!msgtype) {
      throw new Error("msgtype is required.")
    }

    if (
      typeof params.robot_agent_id !== "number" ||
      !Number.isFinite(params.robot_agent_id)
    ) {
      throw new Error("robot_agent_id must be a valid integer.")
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
      agentid: params.robot_agent_id,
      msgtype,
    }

    const touser = params.touser?.trim()
    const toparty = params.toparty?.trim()
    const totag = params.totag?.trim()
    if (touser) body.touser = touser
    if (toparty) body.toparty = toparty
    if (totag) body.totag = totag
    if (params.msgid?.trim()) body.msgid = params.msgid.trim()

    switch (msgtype) {
      case "text":
        body.text = {
          content: params.content?.trim() || "",
        }
        break
      case "markdown":
        body.markdown = {
          content: params.content?.trim() || "",
        }
        break
      case "image":
        body.image = {
          media_id: params.media_id?.trim() || "",
        }
        break
      case "news":
        body.news = {
          articles: [
            {
              title: params.title?.trim() || "",
              description: params.description?.trim() || "",
              url: params.url?.trim() || "",
              picurl: "",
            },
          ],
        }
        break
      case "file":
        body.file = {
          media_id: params.media_id?.trim() || "",
        }
        break
      case "textcard":
        body.textcard = {
          title: params.title?.trim() || "",
          description: params.description?.trim() || "",
          url: params.url?.trim() || "",
        }
        break
      default:
        throw new Error(
          `Unsupported msgtype: ${msgtype}. Supported types: text, markdown, image, news, file, textcard`,
        )
    }

    const data = await wechatWorkPostJson<SendRobotMessageResponse>(
      "/robot/send",
      token,
      body,
    )

    return {
      errcode: data.errcode,
      errmsg: data.errmsg,
      msgid: data.msgid ?? null,
    }
  },
}
