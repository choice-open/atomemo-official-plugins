import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import sendWebhookMessageSkill from "./send-webhook-message-skill.md" with {
  type: "text",
}

type SendWebhookMessageResponse = {
  errcode?: number
  errmsg?: string
}

export const sendWebhookMessageTool: ToolDefinition = {
  name: "wechat-work-send-webhook-message",
  display_name: {
    en_US: "Send group robot message",
    zh_Hans: "发送群机器人消息",
  },
  description: {
    en_US:
      "Send a message via a group chat robot (群机器人) using the webhook URL.",
    zh_Hans: "通过群机器人的Webhook URL发送消息。",
  },
  skill: sendWebhookMessageSkill,
  icon: "🤖",
  parameters: [
    {
      name: "webhook_url",
      type: "string",
      required: true,
      display_name: {
        en_US: "Webhook URL",
        zh_Hans: "Webhook 地址",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The webhook URL of the group robot (found in group settings)",
          zh_Hans: "群机器人的Webhook地址（在群设置中获取）",
        },
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
      name: "markdown",
      type: "string",
      required: false,
      display_name: {
        en_US: "Markdown content",
        zh_Hans: "Markdown 内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Markdown content (required for markdown type). Supports headers, lists, links, bold, italic, code blocks, etc.",
          zh_Hans: "Markdown内容（markdown类型必填）。支持标题、列表、链接、加粗、斜体、代码块等",
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
    {
      name: "btntxt",
      type: "string",
      required: false,
      display_name: {
        en_US: "Button text",
        zh_Hans: "按钮文字",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Button text (optional, for textcard)",
          zh_Hans: "按钮文字（可选，textcard类型使用）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      webhook_url?: string
      msgtype?: string
      content?: string
      markdown?: string
      media_id?: string
      title?: string
      description?: string
      url?: string
      btntxt?: string
    }

    const webhookUrl = params.webhook_url?.trim()
    const msgtype = params.msgtype?.trim() as string

    if (!webhookUrl) {
      throw new Error("webhook_url is required.")
    }
    if (!msgtype) {
      throw new Error("msgtype is required.")
    }

    const body: Record<string, unknown> = {
      msgtype,
    }

    switch (msgtype) {
      case "text":
        body.text = {
          content: params.content?.trim() || "",
        }
        break
      case "markdown":
        body.markdown = {
          content: params.markdown?.trim() || "",
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
          btntxt: params.btntxt?.trim() || "",
        }
        break
      default:
        throw new Error(
          `Unsupported msgtype: ${msgtype}. Supported types: text, markdown, image, news, file, textcard`,
        )
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`Webhook request failed with status ${res.status}`)
    }

    const data = (await res.json()) as SendWebhookMessageResponse
    if (data.errcode !== 0) {
      throw new Error(
        data.errmsg ?? `Webhook API error (errcode=${String(data.errcode)})`,
      )
    }

    return {
      errcode: data.errcode,
      errmsg: data.errmsg,
    }
  },
}
