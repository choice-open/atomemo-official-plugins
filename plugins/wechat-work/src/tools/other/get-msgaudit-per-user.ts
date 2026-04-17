import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getMsgauditPerUserSkill from "./get-msgaudit-per-user-skill.md" with { type: "text" }

type MsgauditMessage = {
  msgid?: string
  action?: string
  from?: string
  roomid?: string
  msgtype?: string
  content?: string
  file?: string
  time?: number
}

type MsgauditConversation = {
  seq?: number
  msgid?: string
  action?: string
  from?: string
  list?: MsgauditMessage[]
}

type GetMsgauditPerUserResponse = {
  errcode?: number
  errmsg?: string
  seq?: number
  conversation?: MsgauditConversation[]
}

export const getMsgauditPerUserTool: ToolDefinition = {
  name: "wechat-work-get-msgaudit-per-user",
  display_name: {
    en_US: "Get member message audit",
    zh_Hans: "获取成员会话存档",
  },
  description: {
    en_US: "Get conversation archiving content for a specific member from WeChat Work.",
    zh_Hans: "获取企业微信指定成员的会话存档内容。",
  },
  skill: getMsgauditPerUserSkill,
  icon: "👤",
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
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The member's userid to get audit content for",
          zh_Hans: "要获取存档的成员 userid",
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
        en_US: "Number of messages",
        zh_Hans: "获取消息的数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of messages to retrieve (default 1000)",
          zh_Hans: "要获取的消息数量，默认1000",
        },
        support_expression: false,
        width: "full",
      },
    },
    {
      name: "seq",
      type: "number",
      required: false,
      display_name: {
        en_US: "Sequence number",
        zh_Hans: "消息序列号",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Sequence number for pagination (from previous response)",
          zh_Hans: "分页用的序列号，从上次返回的 seq 字段获取",
        },
        support_expression: false,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
      limit?: number
      seq?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("User ID is required.")
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

    const body: Record<string, unknown> = { userid }
    if (typeof params.limit === "number" && params.limit > 0) {
      body.limit = params.limit
    } else {
      body.limit = 1000
    }

    if (typeof params.seq === "number" && params.seq > 0) {
      body.seq = params.seq
    }

    const data = await wechatWorkPostJson<GetMsgauditPerUserResponse>(
      "/msgaudit/get_per_user",
      token,
      body,
    )
    const result: {
      seq?: number
      conversation?: Array<{
        seq?: number
        msgid?: string
        action?: string
        from?: string
        list?: Array<{
          msgid?: string
          action?: string
          from?: string
          roomid?: string
          msgtype?: string
          content?: string
          file?: string
          time?: number
        }>
      }>
      message?: string
    } = {}
    if (data.seq !== undefined) result.seq = data.seq
    if (data.conversation) {
      result.conversation = data.conversation.map((conv) => ({
        seq: conv.seq,
        msgid: conv.msgid,
        action: conv.action,
        from: conv.from,
        list: conv.list?.map((msg) => ({
          msgid: msg.msgid,
          action: msg.action,
          from: msg.from,
          roomid: msg.roomid,
          msgtype: msg.msgtype,
          content: msg.content,
          file: msg.file,
          time: msg.time,
        })),
      }))
    }
    if (data.errmsg) result.message = data.errmsg
    return result
  },
}