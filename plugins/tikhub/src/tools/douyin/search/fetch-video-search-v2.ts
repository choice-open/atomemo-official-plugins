import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_video_search_v2",
  method: "POST",
  path: "/api/v1/douyin/search/fetch_video_search_v2",
}

export const tikhub_douyin_fetch_video_search_v2: ToolDefinition = {
  name: "tikhub_douyin_fetch_video_search_v2",
  display_name: {
    en_US: "Douyin · Video Search V2",
    zh_Hans: "抖音 · 获取视频搜索V2",
  },
  description: {
    en_US: "Search Douyin videos by keyword V2. Returns video results matching the query.",
    zh_Hans: "通过关键词搜索抖音视频V2，返回匹配的视频结果。",
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
          en_US: "Search keyword for Douyin video search.",
          zh_Hans: "抖音视频搜索的关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword.", zh_Hans: "搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 美食", zh_Hans: "如：美食" }, width: "full" },
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
    {
      name: "sort_type",
      type: "string",
      required: false,
      default: "0",
      display_name: { en_US: "Sort Type", zh_Hans: "排序方式" },
      ai: {
        llm_description: {
          en_US: "Sort type. 0: default/relevance, 2: latest.",
          zh_Hans: "排序方式。0: 默认/综合排序，2: 最新发布。",
        },
      },
      ui: { hint: { en_US: "0: default, 2: latest.", zh_Hans: "0: 默认，2: 最新。" }, support_expression: true, component: "input", placeholder: { en_US: "0", zh_Hans: "0" } },
    },
    {
      name: "publish_time",
      type: "string",
      required: false,
      default: "0",
      display_name: { en_US: "Publish Time", zh_Hans: "发布时间" },
      ai: {
        llm_description: {
          en_US: "Publish time filter. 0: unlimited, 1: within 1 day, 7: within 7 days, 30: within 30 days.",
          zh_Hans: "发布时间筛选。0: 不限，1: 一天内，7: 七天内，30: 30天内。",
        },
      },
      ui: { hint: { en_US: "0: unlimited, 1: 1 day, 7: 7 days, 30: 30 days.", zh_Hans: "0: 不限，1: 一天内，7: 七天内，30: 30天内。" }, support_expression: true, component: "input", placeholder: { en_US: "0", zh_Hans: "0" } },
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
        sort_type: typeof p.sort_type === "string" ? p.sort_type : undefined,
        publish_time: typeof p.publish_time === "string" ? p.publish_time : undefined,
      },
    })
  },
}
