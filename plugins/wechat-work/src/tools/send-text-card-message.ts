import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendTextCardMessageSkill from "./send-text-card-message-skill.md" with { type: "text" }

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
  msgid?: string
}

export const sendTextCardMessageTool: ToolDefinition = {
  name: "wechat-work-send-text-card-message",
  display_name: {
    en_US: "Send text card message",
    zh_Hans: "发送文本卡片消息",
  },
  description: {
    en_US: "Send a text card message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送文本卡片消息。",
  },
  skill: sendTextCardMessageSkill,
  icon: "📝",
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
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Text card title (max 128 characters)",
          zh_Hans: "文本卡片标题，最多128个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: true,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Text card description (max 512 characters)",
          zh_Hans: "文本卡片描述，最多512个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "url",
      type: "string",
      required: true,
      display_name: {
        en_US: "Click URL",
        zh_Hans: "点击跳转URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "URL to redirect when clicked",
          zh_Hans: "点击卡片后的跳转链接",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "btn_txt",
      type: "string",
      required: false,
      display_name: {
        en_US: "Button text",
        zh_Hans: "按钮文字",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Button text (max 100 characters)",
          zh_Hans: "按钮文字，最多100个字符",
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
      title?: string
      description?: string
      url?: string
      btn_txt?: string
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

    const title = params.title?.trim()
    if (!title) {
      throw new Error("title is required.")
    }

    const description = params.description?.trim()
    if (!description) {
      throw new Error("description is required.")
    }

    const url = params.url?.trim()
    if (!url) {
      throw new Error("url is required.")
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
      msgtype: "textcard",
      agentid: params.agent_id,
      textcard: {
        title,
        description,
        url,
      },
    }
    if (touser) body.touser = touser
    if (toparty) body.toparty = toparty
    if (totag) body.totag = totag

    const btnTxt = params.btn_txt?.trim()
    if (btnTxt) {
      body.textcard = { ...(body.textcard as object), btntxt: btnTxt }
    }
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