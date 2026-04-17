import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listCommonMailAccountsSkill from "./list-common-mail-accounts-skill.md" with { type: "text" }

type ListCommonMailAccountsResponse = {
  errcode?: number
  errmsg?: string
  list?: Array<{
    account: string
    alias?: string
    name?: string
    organization?: string
    address?: string
    allow_from_external?: number
    user_list?: Array<{
      userid: string
      is_admin?: number
    }>
  }>
  has_more?: boolean
}

export const listCommonMailAccountsTool: ToolDefinition = {
  name: "wechat-work-list-common-mail-accounts",
  display_name: {
    en_US: "List common mail accounts",
    zh_Hans: "获取公共邮箱",
  },
  description: {
    en_US: "Get the list of common mail accounts.",
    zh_Hans: "获取公共邮箱列表。",
  },
  skill: listCommonMailAccountsSkill,
  icon: "🏢",
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

    const data = await wechatWorkGetJson<ListCommonMailAccountsResponse>(
      "/mail/common_mail_account/list",
      token,
      query,
    )
    return {
      list: data.list ?? [],
      has_more: data.has_more ?? false,
    }
  },
}