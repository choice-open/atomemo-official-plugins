import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_experience_search",
  method: "POST",
  path: "/api/v1/douyin/search/fetch_experience_search",
}

export const tikhub_douyin_fetch_experience_search: ToolDefinition = {
  name: "tikhub_douyin_fetch_experience_search",
  display_name: {
    en_US: "Douyin · Experience Search",
    zh_Hans: "抖音 · 获取经验搜索",
  },
  description: {
    en_US: "Search Douyin experience/guide posts by keyword. Returns experience content matching the query.",
    zh_Hans: "通过关键词搜索抖音经验/攻略内容，返回匹配的经验结果。",
  },
  icon: "🎬",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "tikhub-api-key",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "keyword",
      type: "string",
      required: true,
      display_name: { en_US: "Keyword", zh_Hans: "搜索关键词" },
      ai: {
        llm_description: {
          en_US: "Search keyword for Douyin experience search.",
          zh_Hans: "抖音经验搜索的关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword.", zh_Hans: "搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 旅行攻略", zh_Hans: "如：旅行攻略" }, width: "full" },
    },
    {
      name: "cursor",
      type: "integer",
      required: false,
      default: 0,
      display_name: { en_US: "Cursor", zh_Hans: "游标" },
      ai: {
        llm_description: {
          en_US: "Pagination cursor, starting from 0.",
          zh_Hans: "分页游标，从 0 开始。",
        },
      },
      ui: { hint: { en_US: "Pagination cursor, default 0.", zh_Hans: "分页游标，默认 0。" }, support_expression: true, component: "number-input" },
    },
    {
      name: "count",
      type: "integer",
      required: false,
      default: 20,
      display_name: { en_US: "Count", zh_Hans: "数量" },
      ai: {
        llm_description: {
          en_US: "Number of results per page, default 20.",
          zh_Hans: "每页结果数量，默认 20。",
        },
      },
      ui: { hint: { en_US: "Number of results per page.", zh_Hans: "每页结果数量。" }, support_expression: true, component: "number-input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const keyword = readRequiredStringParam(p, "keyword")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      body: {
        keyword,
        cursor: typeof p.cursor === "number" ? p.cursor : undefined,
        count: typeof p.count === "number" ? p.count : undefined,
      },
    })
  },
}
