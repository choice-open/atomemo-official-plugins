import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import syncKfMessagesSkill from "./sync-kf-messages-skill.md" with { type: "text" }

type KfMsgItem = {
  msgid?: string
  openid?: string
  msgtype?: string
  content?: string
  create_time?: number
}

type SyncKfMessagesResponse = {
  errcode?: number
  errmsg?: string
  next_cursor?: string
  has_more?: number
  msg_list?: KfMsgItem[]
}

export const syncKfMessagesTool: ToolDefinition = {
  name: "wechat-work-sync-kf-messages",
  display_name: {
    en_US: "Sync customer service messages",
    zh_Hans: "读取客服消息与事件",
  },
  description: {
    en_US: "Sync customer service messages and events from the last 3 days.",
    zh_Hans: "读取近三天的客服消息与事件。",
  },
  skill: syncKfMessagesSkill,
  icon: "📥",
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
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cursor for pagination",
          zh_Hans: "用于分页的游标",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "number",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "返回条数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of messages (default 100, max 1000)",
          zh_Hans: "返回条数，默认100，最大1000",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      cursor?: string
      limit?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const body: Record<string, unknown> = {}

    if (params.cursor?.trim()) {
      body.cursor = params.cursor.trim()
    }

    if (typeof params.limit === "number" && params.limit > 0) {
      body.limit = Math.min(Math.max(params.limit, 1), 1000)
    }

    const data = await wechatWorkPostJson<SyncKfMessagesResponse>(
      "/kf/sync_msg",
      token,
      body,
    )
    return {
      has_more: data.has_more === 1,
      next_cursor: data.next_cursor ?? "",
      msg_list: data.msg_list ?? [],
    }
  },
}