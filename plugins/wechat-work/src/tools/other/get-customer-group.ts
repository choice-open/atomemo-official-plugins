import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getCustomerGroupSkill from "./get-customer-group-skill.md" with { type: "text" }

type GetGroupChatResponse = {
  errcode?: number
  errmsg?: string
  group_chat?: {
    chat_id: string
    name?: string
    owner?: string
    create_time?: number
    notice?: string
    member_list?: Array<{
      userid?: string
      type?: number
      join_time?: number
      unionid?: string
      name?: string
      status?: number
    }>
    admin_list?: Array<{
      userid: string
    }>
  }
}

export const getCustomerGroupTool: ToolDefinition = {
  name: "wechat-work-get-customer-group",
  display_name: {
    en_US: "Get customer group details",
    zh_Hans: "获取客户群详情",
  },
  description: {
    en_US: "Get detailed information of a customer group chat.",
    zh_Hans: "获取客户群聊的详细信息。",
  },
  skill: getCustomerGroupSkill,
  icon: "👥",
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
      name: "chat_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Chat ID",
        zh_Hans: "客户群聊ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The chat ID of the customer group",
          zh_Hans: "客户群的 chat_id",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "need_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Need group name",
        zh_Hans: "需要群名",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to return group name",
          zh_Hans: "是否返回群名",
        },
        options: [
          { label: { en_US: "No", zh_Hans: "否" }, value: "0" },
          { label: { en_US: "Yes", zh_Hans: "是" }, value: "1" },
        ],
      },
    },
    {
      name: "offset",
      type: "string",
      required: false,
      display_name: {
        en_US: "Member offset",
        zh_Hans: "成员偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Offset for member list pagination",
          zh_Hans: "成员列表偏移量",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Member limit",
        zh_Hans: "成员数量限制",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Limit for member list (max 1000)",
          zh_Hans: "成员列表限制，最大1000",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      chat_id?: string
      need_name?: string
      offset?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const chatId = params.chat_id?.trim()
    if (!chatId) {
      throw new Error("chat_id is required.")
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

    const body: Record<string, unknown> = { chat_id: chatId }

    const needName = params.need_name?.trim()
    if (needName) body.need_name = parseInt(needName, 10)

    const offset = params.offset?.trim()
    if (offset) body.offset = parseInt(offset, 10)

    const limit = params.limit?.trim()
    if (limit) body.limit = parseInt(limit, 10)

    const data = await wechatWorkPostJson<GetGroupChatResponse>(
      "/externalcontact/groupchat/get",
      token,
      body,
    )
    return data.group_chat ?? null
  },
}
