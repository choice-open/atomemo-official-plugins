import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import listKfAccountsSkill from "./list-kf-accounts-skill.md" with { type: "text" }

type ListKfAccountsResponse = {
  errcode?: number
  errmsg?: string
  account_list?: Array<{
    open_kfid: string
    name: string
    avatar: string
    manage_privilege?: boolean
  }>
}

export const listKfAccountsTool: ToolDefinition = {
  name: "wechat-work-list-kf-accounts",
  display_name: {
    en_US: "List customer service accounts",
    zh_Hans: "获取客服账号列表",
  },
  description: {
    en_US:
      "Get the list of customer service accounts, including ID, name, and avatar.",
    zh_Hans:
      "获取客服账号列表，包括客服账号的客服ID、名称和头像。",
  },
  skill: listKfAccountsSkill,
  icon: "🎧",
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
      type: "integer",
      required: false,
      default: 0,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Pagination offset, starting from 0",
          zh_Hans: "分页，偏移量，默认为0",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "integer",
      required: false,
      default: 100,
      display_name: {
        en_US: "Limit",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Number of results per page (1-100, default 100)",
          zh_Hans: "预期请求的数据量，默认为100，取值范围 1~100",
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
      throw new Error("请选择企业微信凭证。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const body: Record<string, unknown> = {}
    if (typeof params.offset === "number") body.offset = params.offset
    if (typeof params.limit === "number")
      body.limit = Math.min(Math.max(params.limit, 1), 100)

    const data = await wechatWorkPostJson<ListKfAccountsResponse>(
      "/kf/account/list",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      account_list: data.account_list ?? [],
    }
  },
}
