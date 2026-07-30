import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  publishTimeValues,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalIntegerParam,
  readOptionalStringParam,
  searchBusinessTypeValues,
  searchSortValues,
  wechatIntegerParameter,
  wechatSelectParameter,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_search_fetch_search",
  method: "POST",
  path: "/api/v1/wechat_search/v2/fetch_search",
}

export const tikhub_wechat_search_fetch_search: ToolDefinition = {
  name: "tikhub_wechat_search_fetch_search",
  display_name: {
    en_US: "WeChat Search · Universal Search",
    zh_Hans: "微信搜一搜 · 综合搜索",
  },
  description: {
    en_US:
      "Search WeChat across official accounts, articles, Channels videos, news, images, and other verticals.",
    zh_Hans: "通过微信搜一搜搜索公众号、文章、视频号、新闻、图片等垂类内容。",
  },
  icon: "🔎",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Required search keyword, 1-100 characters.",
        zh_Hans: "必填搜索关键词，1-100 个字符。",
      },
      llmDescription: {
        en_US:
          "Required WeChat Search keyword. Keep it between 1 and 100 characters.",
        zh_Hans: "微信搜一搜必填关键词，长度 1-100 个字符。",
      },
      placeholder: { en_US: "AI agent", zh_Hans: "AI 智能体" },
    }),
    wechatSelectParameter({
      name: "business_type",
      values: searchBusinessTypeValues,
      default: "all",
      displayName: { en_US: "Business Type", zh_Hans: "搜索垂类" },
      hint: {
        en_US:
          "OpenAPI default all. Use account for official accounts, article for articles, or video for Channels videos.",
        zh_Hans:
          "OpenAPI 默认 all。公众号用 account，文章用 article，视频号视频用 video。",
      },
      llmDescription: {
        en_US:
          "WeChat Search vertical. Valid values: all, account, article, video, live_stream, moments, news, book, listen, image, encyclopedia, weixin_index.",
        zh_Hans:
          "微信搜索垂类。有效值：all、account、article、video、live_stream、moments、news、book、listen、image、encyclopedia、weixin_index。",
      },
    }),
    wechatSelectParameter({
      name: "sort",
      values: searchSortValues,
      default: "default",
      displayName: { en_US: "Sort", zh_Hans: "排序" },
      hint: {
        en_US: "Use string keys only: default, latest, or hot.",
        zh_Hans: "仅使用字符串键：default、latest、hot。",
      },
      llmDescription: {
        en_US:
          "Sort order. Must be one of default, latest, hot. Do not use numeric aliases.",
        zh_Hans:
          "排序方式。必须为 default、latest、hot 之一，不要使用数字别名。",
      },
    }),
    wechatSelectParameter({
      name: "publish_time",
      values: publishTimeValues,
      default: "all",
      displayName: { en_US: "Publish Time", zh_Hans: "发布时间" },
      hint: {
        en_US: "Use all, day, week, or half_year.",
        zh_Hans: "使用 all、day、week、half_year。",
      },
      llmDescription: {
        en_US:
          "Publish time filter. Must be one of all, day, week, half_year. Keep this filter unchanged when paginating with cursor.",
        zh_Hans:
          "发布时间筛选。必须为 all、day、week、half_year 之一。使用 cursor 翻页时保持该筛选不变。",
      },
    }),
    wechatIntegerParameter({
      name: "offset",
      default: 0,
      min: 0,
      displayName: { en_US: "Offset", zh_Hans: "Offset" },
      hint: {
        en_US:
          "OpenAPI default 0. Only useful for the first request; use cursor for real pagination.",
        zh_Hans: "OpenAPI 默认 0。仅用于首次请求，真正翻页请使用 cursor。",
      },
      llmDescription: {
        en_US:
          "First-page offset, default 0. Offset alone does not paginate; pass the previous response cursor unchanged.",
        zh_Hans:
          "首次请求 offset，默认 0。单独 offset 不能翻页；请原样传回上次响应 cursor。",
      },
    }),
    wechatStringParameter({
      name: "cursor",
      required: false,
      displayName: { en_US: "Cursor", zh_Hans: "分页 cursor" },
      hint: {
        en_US:
          "Leave empty for the first page. For the next page, pass the returned cursor unchanged.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 cursor。",
      },
      llmDescription: {
        en_US:
          "Opaque WeChat Search pagination cursor. Do not parse, decode, or rewrite it; keep filters unchanged when using it.",
        zh_Hans:
          "微信搜一搜不透明分页 cursor。不要解析、解码或改写；使用时保持筛选条件不变。",
      },
      placeholder: {
        en_US: "Leave empty for first page",
        zh_Hans: "首次请求留空",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      keyword: readOptionalStringParam(p, "keyword"),
      business_type: readOptionalStringParam(p, "business_type") ?? "all",
      sort: readOptionalStringParam(p, "sort") ?? "default",
      publish_time: readOptionalStringParam(p, "publish_time") ?? "all",
      offset: readOptionalIntegerParam(p, "offset") ?? 0,
      cursor: readOptionalStringParam(p, "cursor"),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
