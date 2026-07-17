import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_music_search",
  method: "POST",
  path: "/api/v1/douyin/search/fetch_music_search",
}

export const tikhub_douyin_fetch_music_search: ToolDefinition = {
  name: "tikhub_douyin_fetch_music_search",
  display_name: {
    en_US: "Douyin · Music Search",
    zh_Hans: "抖音 · 获取音乐搜索",
  },
  description: {
    en_US: "Search Douyin music/audio by keyword. Returns music tracks matching the query.",
    zh_Hans: "通过关键词搜索抖音音乐/音频，返回匹配的音乐结果。",
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
          en_US: "Search keyword for Douyin music search.",
          zh_Hans: "抖音音乐搜索的关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword.", zh_Hans: "搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 周杰伦", zh_Hans: "如：周杰伦" }, width: "full" },
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
