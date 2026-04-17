import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listCustomerGroupsSkill from "./list-customer-groups-skill.md" with {
  type: "text",
}

type ListGroupChatResponse = {
  errcode?: number
  errmsg?: string
  group_chat_list?: Array<{
    chat_id: string
    name: string
    owner: string
  }>
  next_cursor?: string
}

export const listCustomerGroupsTool: ToolDefinition = {
  name: "wechat-work-list-customer-groups",
  display_name: {
    en_US: "List customer groups",
    zh_Hans: "获取客户群列表",
  },
  description: {
    en_US: "Get the list of customer groups (external contact group chats).",
    zh_Hans: "获取客户群（外部联系人群聊）列表。",
  },
  skill: listCustomerGroupsSkill,
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
      name: "status_filter",
      type: "string",
      required: true,
      display_name: {
        en_US: "Status filter",
        zh_Hans: "客户群状态筛选",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Filter by customer group status",
          zh_Hans: "按客户群状态筛选",
        },
        options: [
          { label: { en_US: "All", zh_Hans: "全部" }, value: "0" },
          { label: { en_US: "Normal", zh_Hans: "正常" }, value: "1" },
          { label: { en_US: "Pending transfer", zh_Hans: "离职待继承" }, value: "2" },
          { label: { en_US: "Transferring", zh_Hans: "继承中" }, value: "3" },
          { label: { en_US: "Transferred", zh_Hans: "已转出" }, value: "4" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit per page",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of results per page (default: 1000, max: 1000)",
          zh_Hans: "每页返回数量，默认1000，最大1000",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor from previous response",
          zh_Hans: "分页游标，使用上次返回的next_cursor",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "owner_filter",
      type: "string",
      required: false,
      display_name: {
        en_US: "Owner userid filter",
        zh_Hans: "群主 userid 筛选",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by group owner userid",
          zh_Hans: "按群主 userid 筛选客户群",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "self",
      type: "string",
      required: false,
      display_name: {
        en_US: "Filter by current user",
        zh_Hans: "仅看属于我的群",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Filter groups owned by current user",
          zh_Hans: "仅看属于该agent的群",
        },
        options: [
          { label: { en_US: "All", zh_Hans: "全部" }, value: "0" },
          { label: { en_US: "Only mine (1)", zh_Hans: "仅看属于我的 (1)" }, value: "1" },
          { label: { en_US: "Only mine (2)", zh_Hans: "仅看属于我的 (2)" }, value: "2" },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      status_filter?: string
      limit?: string
      cursor?: string
      owner_filter?: string
      self?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const statusFilter = params.status_filter?.trim()
    if (!statusFilter) {
      throw new Error("Status filter is required.")
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
      status_filter: parseInt(statusFilter, 10),
      limit: params.limit?.trim() ? Math.min(parseInt(params.limit.trim(), 10), 1000) : 1000,
    }
    const cursor = params.cursor?.trim()
    if (cursor) body.cursor = cursor

    const ownerFilter = params.owner_filter?.trim()
    if (ownerFilter) {
      body.owner_filter = { userid_list: [ownerFilter] }
    }

    const self = params.self?.trim()
    if (self) body.self = parseInt(self, 10)

    const data = await wechatWorkPostJson<ListGroupChatResponse>(
      "/externalcontact/groupchat/list",
      token,
      body,
    )
    return {
      group_chat_list: data.group_chat_list ?? [],
      next_cursor: data.next_cursor ?? "",
    }
  },
}
