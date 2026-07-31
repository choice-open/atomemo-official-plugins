import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  allowNsfwValues,
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  readTrimmedRequired,
  redditSelectParameter,
  redditStringParameter,
  safeSearchValues,
  searchSortValues,
  searchTimeRangeValues,
  searchTypeValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_dynamic_search",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_dynamic_search",
}

export const tikhub_reddit_dynamic_search: ToolDefinition = {
  name: "tikhub_reddit_dynamic_search",
  display_name: {
    en_US: "Reddit · Dynamic Search",
    zh_Hans: "Reddit · 动态关键词搜索",
  },
  description: {
    en_US:
      "Search Reddit posts, communities, comments, media, or people by keyword.",
    zh_Hans: "按关键词搜索 Reddit 帖子、社区、评论、媒体或用户。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "query",
      required: true,
      displayName: { en_US: "Query", zh_Hans: "关键词" },
      hint: {
        en_US: "Required Reddit search keyword.",
        zh_Hans: "必填 Reddit 搜索关键词。",
      },
      llmDescription: {
        en_US:
          "Required Reddit keyword for social listening, customer-demand discovery, competitor monitoring, or user research.",
        zh_Hans:
          "Reddit 搜索必填关键词，可用于舆情、需求、竞品口碑或用户研究。",
      },
      placeholder: { en_US: "AI coding agent", zh_Hans: "AI 编程助手" },
    }),
    redditSelectParameter({
      name: "search_type",
      values: searchTypeValues,
      default: "post",
      displayName: { en_US: "Search Type", zh_Hans: "搜索类型" },
      hint: {
        en_US:
          "OpenAPI default post. Choose post, community, comment, media, or people.",
        zh_Hans: "OpenAPI 默认 post。可选帖子、社区、评论、媒体或用户。",
      },
      llmDescription: {
        en_US:
          "Search type. Valid values: post, community, comment, media, people. community and people ignore sort and time_range.",
        zh_Hans:
          "搜索类型。有效值：post、community、comment、media、people。community 和 people 会忽略 sort/time_range。",
      },
    }),
    redditSelectParameter({
      name: "sort",
      values: searchSortValues,
      required: true,
      default: "RELEVANCE",
      displayName: { en_US: "Sort", zh_Hans: "排序" },
      hint: {
        en_US:
          "Required, default RELEVANCE. Sent for post, comment, and media; ignored for community and people. COMMENTS is only valid for post.",
        zh_Hans:
          "必填，默认 RELEVANCE。post、comment、media 会发送；community、people 会忽略。COMMENTS 仅适用于 post。",
      },
      llmDescription: {
        en_US:
          "Required sort method, default RELEVANCE. Valid values: RELEVANCE, HOT, TOP, NEW, COMMENTS. Omit for community or people. COMMENTS is valid only when search_type is post.",
        zh_Hans:
          "必填排序方式，默认 RELEVANCE。有效值：RELEVANCE、HOT、TOP、NEW、COMMENTS。community/people 省略。COMMENTS 仅允许 post。",
      },
      display: {
        show: { search_type: { $in: ["post", "comment", "media"] } },
      },
    }),
    redditSelectParameter({
      name: "time_range",
      values: searchTimeRangeValues,
      displayName: { en_US: "Time Range", zh_Hans: "时间范围" },
      hint: {
        en_US:
          "Only for post and media. Omit for comment, community, and people.",
        zh_Hans: "仅适用于 post 和 media。comment、community、people 会省略。",
      },
      llmDescription: {
        en_US:
          "Time range filter. Valid values: all, year, month, week, day, hour. Send only for search_type post or media.",
        zh_Hans:
          "时间范围筛选。有效值：all、year、month、week、day、hour。仅 post/media 发送。",
      },
      display: { show: { search_type: { $in: ["post", "media"] } } },
    }),
    redditSelectParameter({
      name: "safe_search",
      values: safeSearchValues,
      default: "unset",
      displayName: { en_US: "Safe Search", zh_Hans: "安全搜索" },
      hint: {
        en_US: "OpenAPI default unset. Use strict for stricter filtering.",
        zh_Hans: "OpenAPI 默认 unset。strict 表示更严格过滤。",
      },
      llmDescription: {
        en_US: "Safe search setting. Valid values: unset, strict.",
        zh_Hans: "安全搜索设置。有效值：unset、strict。",
      },
    }),
    redditSelectParameter({
      name: "allow_nsfw",
      values: allowNsfwValues,
      default: "0",
      displayName: { en_US: "Allow NSFW", zh_Hans: "允许 NSFW" },
      hint: {
        en_US:
          "OpenAPI default 0. Use 1 only when NSFW results are intentionally allowed.",
        zh_Hans: "OpenAPI 默认 0。只有明确允许 NSFW 时使用 1。",
      },
      llmDescription: {
        en_US:
          "Whether to allow NSFW content. Valid values: 0 means no, 1 means yes.",
        zh_Hans: "是否允许 NSFW 内容。有效值：0 表示不允许，1 表示允许。",
      },
    }),
    redditStringParameter({
      name: "after",
      default: "",
      displayName: { en_US: "After", zh_Hans: "分页 after" },
      hint: {
        en_US:
          "OpenAPI default empty. For pagination, pass the returned after cursor unchanged.",
        zh_Hans: "OpenAPI 默认空字符串。翻页时原样传回响应中的 after cursor。",
      },
      llmDescription: {
        en_US: "Opaque pagination cursor. Do not parse, decode, or rewrite it.",
        zh_Hans: "不透明分页 cursor。不要解析、解码或改写。",
      },
      placeholder: {
        en_US: "Leave empty for first page",
        zh_Hans: "首次请求留空",
      },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const searchType = readOptionalStringParam(p, "search_type") ?? "post"
    const sort = readOptionalStringParam(p, "sort") ?? "RELEVANCE"
    const timeRange = readOptionalStringParam(p, "time_range")
    const allowsSort = ["post", "comment", "media"].includes(searchType)
    const allowsTimeRange = ["post", "media"].includes(searchType)

    if (allowsSort && sort === "COMMENTS" && searchType !== "post") {
      throw new Error("sort=COMMENTS is only valid when search_type is post.")
    }

    return invokeRedditGet(endpoint, args, {
      query: readTrimmedRequired(p, "query", "query"),
      search_type: searchType,
      sort: allowsSort ? sort : undefined,
      time_range: allowsTimeRange ? timeRange : undefined,
      safe_search: readOptionalStringParam(p, "safe_search") ?? "unset",
      allow_nsfw: readOptionalStringParam(p, "allow_nsfw") ?? "0",
      after: readOptionalStringParam(p, "after"),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
