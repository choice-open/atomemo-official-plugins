import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_image_search_v3",
  method: "POST",
  path: "/api/v1/douyin/search/fetch_image_search_v3",
}

export const tikhub_douyin_fetch_image_search_v3: ToolDefinition = {
  name: "tikhub_douyin_fetch_image_search_v3",
  display_name: {
    en_US: "Douyin · Image-Text Search V3",
    zh_Hans: "抖音 · 获取图文搜索V3",
  },
  description: {
    en_US: "Search Douyin image-text posts by keyword V3. Returns mixed image and text content matching the query.",
    zh_Hans: "通过关键词搜索抖音图文内容V3，返回匹配的图文结果。",
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
          en_US: "Search keyword for Douyin image-text search.",
          zh_Hans: "抖音图文搜索的关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword.", zh_Hans: "搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 穿搭", zh_Hans: "如：穿搭" }, width: "full" },
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
      enum: ["0", "2"],
      ai: {
        llm_description: {
          en_US: "Sort order for search results. Must be one of: 0 (default/relevance), 2 (latest).",
          zh_Hans: "搜索结果排序方式。可选值：0（综合排序），2（最新发布）。",
        },
      },
      ui: { hint: { en_US: "Sort order for search results.", zh_Hans: "搜索结果排序方式。" }, support_expression: true, component: "select" },
    },
    {
      name: "publish_time",
      type: "string",
      required: false,
      default: "0",
      display_name: { en_US: "Publish Time", zh_Hans: "发布时间" },
      enum: ["0", "1", "7", "30"],
      ai: {
        llm_description: {
          en_US: "Publish time filter. Must be one of: 0 (unlimited), 1 (within 1 day), 7 (within 7 days), 30 (within 30 days).",
          zh_Hans: "发布时间筛选。可选值：0（不限），1（一天内），7（七天内），30（30天内）。",
        },
      },
      ui: { hint: { en_US: "Filter by publish time.", zh_Hans: "按发布时间筛选。" }, support_expression: true, component: "select" },
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
