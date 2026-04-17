import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendTemplateCardMessageSkill from "./send-template-card-message-skill.md" with { type: "text" }

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
  msgid?: string
}

export const sendTemplateCardMessageTool: ToolDefinition = {
  name: "wechat-work-send-template-card-message",
  display_name: {
    en_US: "Send template card message",
    zh_Hans: "发送模板卡片消息",
  },
  description: {
    en_US: "Send a template card message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送模板卡片消息。",
  },
  skill: sendTemplateCardMessageSkill,
  icon: "🎴",
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
      name: "agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of your self-built app",
          zh_Hans: "自建应用的 AgentId",
        },
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
          en_US: "Pipe-separated userids, e.g. zhangsan|lisi. Use @all to send to all members.",
          zh_Hans: "成员 userid，多个用 | 分隔。使用 @all 发送给全部成员。",
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
          en_US: "Pipe-separated partyids, e.g. 1|2|3",
          zh_Hans: "部门ID，多个用 | 分隔",
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
          en_US: "Pipe-separated tagids, e.g. 1|2|3",
          zh_Hans: "标签ID，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "template_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Template card ID",
        zh_Hans: "模板卡片ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Template card ID from work console",
          zh_Hans: "模板卡片ID，从工作台配置获取",
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
          en_US: "Card title (first priority)",
          zh_Hans: "卡片标题，优先级高于template_card.title",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "highlight",
      type: "string",
      required: false,
      display_name: {
        en_US: "Highlight text",
        zh_Hans: "强调文字",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Highlight text to show in yellow",
          zh_Hans: "展示的黄色强调文字",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sub_title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Subtitle",
        zh_Hans: "副标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Subtitle of the card",
          zh_Hans: "卡片副标题",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "image_url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Image URL",
        zh_Hans: "图片URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Image URL to display on the card",
          zh_Hans: "卡片显示图片的URL",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "buttons",
      type: "string",
      required: true,
      display_name: {
        en_US: "Buttons (JSON array)",
        zh_Hans: "按钮列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of buttons: [{\"action_type\":\"1\",\"title\":\"xxx\",\"url\":\"xxx\"}]",
          zh_Hans: "按钮JSON数组，action_type: 1跳转网页, 2打开小程序",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "safe",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Confidential message",
        zh_Hans: "保密消息",
      },
      ui: {
        component: "select",
        options: [
          { label: "No (可对外分享)", value: 0 },
          { label: "Yes (不能分享显示水印)", value: 1 },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: number
      touser?: string
      toparty?: string
      totag?: string
      template_id?: string
      title?: string
      highlight?: string
      sub_title?: string
      image_url?: string
      buttons?: string
      safe?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const touser = params.touser?.trim()
    const toparty = params.toparty?.trim()
    const totag = params.totag?.trim()
    if (!touser && !toparty && !totag) {
      throw new Error("At least one of touser, toparty, or totag is required.")
    }

    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
    }

    const templateId = params.template_id?.trim()
    if (!templateId) {
      throw new Error("template_id is required.")
    }

    const buttonsStr = params.buttons?.trim()
    if (!buttonsStr) {
      throw new Error("buttons is required.")
    }

    let buttons: Array<{ action_type: number; title: string; url: string }> =
      []
    try {
      buttons = JSON.parse(buttonsStr)
    } catch {
      throw new Error("buttons must be a valid JSON array.")
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

    const templateCard: Record<string, unknown> = {
      template_id: templateId,
    }

    const title = params.title?.trim()
    if (title) templateCard.title = title

    const highlight = params.highlight?.trim()
    if (highlight) templateCard.highlight = highlight

    const subTitle = params.sub_title?.trim()
    if (subTitle) templateCard.sub_title = subTitle

    const imageUrl = params.image_url?.trim()
    if (imageUrl) templateCard.image_url = imageUrl

    if (buttons.length > 0) templateCard.buttons = buttons

    const body: Record<string, unknown> = {
      msgtype: "template_card",
      agentid: params.agent_id,
      template_card: templateCard,
    }
    if (touser) body.touser = touser
    if (toparty) body.toparty = toparty
    if (totag) body.totag = totag
    if (typeof params.safe === "number") body.safe = params.safe

    const data = await wechatWorkPostJson<SendMessageResponse>(
      "/message/send",
      token,
      body,
    )
    return {
      msgid: data.msgid ?? null,
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
      invalidtag: data.invalidtag ?? "",
    }
  },
}