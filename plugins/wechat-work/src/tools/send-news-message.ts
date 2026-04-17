import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendNewsMessageSkill from "./send-news-message-skill.md" with {
  type: "text",
}

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
}

type Article = {
  title?: string
  description?: string
  url?: string
  picurl?: string
}

export const sendNewsMessageTool: ToolDefinition = {
  name: "wechat-work-send-news",
  display_name: {
    en_US: "Send news message",
    zh_Hans: "发送图文消息",
  },
  description: {
    en_US:
      "Send a news/article message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送图文消息。",
  },
  skill: sendNewsMessageSkill,
  icon: "📰",
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
      name: "articles",
      type: "string",
      required: true,
      display_name: {
        en_US: "Articles (JSON)",
        zh_Hans: "文章列表 (JSON)",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US:
            'JSON array of articles: [{"title":"...","description":"...","url":"...","picurl":"..."}]',
          zh_Hans:
            '文章JSON数组：[{"title":"标题","description":"描述","url":"链接","picurl":"图片链接"}]',
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
      articles?: string
      safe?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const touser = params.touser?.trim()
    const toparty = params.toparty?.trim()
    const totag = params.totag?.trim()
    const articlesStr = params.articles?.trim()
    if (!touser && !toparty && !totag) {
      throw new Error("At least one of touser, toparty, or totag is required.")
    }
    if (!articlesStr) {
      throw new Error("articles is required.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
    }

    let articles: Article[]
    try {
      articles = JSON.parse(articlesStr)
      if (!Array.isArray(articles)) {
        throw new Error("articles must be an array")
      }
    } catch {
      throw new Error("Invalid JSON in articles field")
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

    const data = await wechatWorkPostJson<SendMessageResponse>(
      "/message/send",
      token,
      {
        touser: touser || undefined,
        toparty: toparty || undefined,
        totag: totag || undefined,
        msgtype: "news",
        agentid: params.agent_id,
        news: { articles },
        ...(typeof params.safe === "number" ? { safe: params.safe } : {}),
      },
    )
    return {
      msgid: data.msgid ?? null,
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
      invalidtag: data.invalidtag ?? "",
    }
  },
}
