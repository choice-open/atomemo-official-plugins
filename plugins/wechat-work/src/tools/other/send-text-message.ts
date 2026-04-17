import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendTextMessageSkill from "./send-text-message-skill.md" with {
  type: "text",
}

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
  msgid?: string
}

export const sendTextMessageTool: ToolDefinition = {
  name: "wechat-work-send-text-message",
  display_name: {
    en_US: "Send app text message",
    zh_Hans: "发送应用文本消息",
  },
  description: {
    en_US:
      "Send a text message to members via a self-built application (消息推送).",
    zh_Hans: "通过自建应用向成员发送文本消息（应用消息）。",
  },
  skill: sendTextMessageSkill,
  icon: "✉️",
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
          en_US:
            "The numeric agent id of your self-built app (应用管理 → 应用详情).",
          zh_Hans: "自建应用的 AgentId（应用管理 → 对应应用详情）。",
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
          en_US:
            "Pipe-separated userids, e.g. zhangsan|lisi. Use @all to send to all members.",
          zh_Hans: "成员 userid，多个用 | 分隔，例如 zhangsan|lisi。使用 @all 发送给全部成员。",
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
          zh_Hans: "部门ID，多个用 | 分隔，例如 1|2|3",
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
          zh_Hans: "标签ID，多个用 | 分隔，例如 1|2|3",
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
        en_US: "Message content",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Message text (max 2048 bytes, supports newlines and links)",
          zh_Hans: "消息内容，最长不超过2048字节，支持换行以及A标签",
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
      content?: string
      safe?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const touser = params.touser?.trim()
    const toparty = params.toparty?.trim()
    const totag = params.totag?.trim()
    const content = params.content?.trim()
    if (!content) {
      throw new Error("content is required.")
    }
    if (!touser && !toparty && !totag) {
      throw new Error("At least one of touser, toparty, or totag is required.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
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
      msgtype: "text",
      agentid: params.agent_id,
      text: { content },
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
