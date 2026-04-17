import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listAdminMailboxesSkill from "./list-admin-mailboxes-skill.md" with { type: "text" }

type ListAdminMailboxesResponse = {
  errcode?: number
  errmsg?: string
  list?: Array<{
    account: string
    alias?: string
    name?: string
    organization?: string
    address?: string
    user_list?: Array<{
      userid: string
      is_admin?: number
    }>
  }>
  has_more?: boolean
}

export const listAdminMailboxesTool: ToolDefinition = {
  name: "wechat-work-list-admin-mailboxes",
  display_name: {
    en_US: "List admin mailboxes",
    zh_Hans: "获取管理员邮箱",
  },
  description: {
    en_US: "Get the list of admin mailboxes.",
    zh_Hans: "获取管理员邮箱列表。",
  },
  skill: listAdminMailboxesSkill,
  icon: "🔧",
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
      name: "offset",
      type: "number",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Offset for pagination",
          zh_Hans: "分页偏移量",
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
        en_US: "Page size",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of items per page (default 100)",
          zh_Hans: "每页数量，默认100",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      offset?: number
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

    const query: Record<string, string> = {}
    if (typeof params.offset === "number") {
      query.offset = String(params.offset)
    }
    if (typeof params.limit === "number") {
      query.limit = String(params.limit)
    }

    const data = await wechatWorkGetJson<ListAdminMailboxesResponse>(
      "/mail/admin_mailbox/list",
      token,
      query,
    )
    return {
      list: data.list ?? [],
      has_more: data.has_more ?? false,
    }
  },
}