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
  readRequiredConstrainedStringParam,
  searchSortValues,
  videoDurationValues,
  wechatIntegerParameter,
  wechatSelectParameter,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_search_fetch_search_videos",
  method: "POST",
  path: "/api/v1/wechat_search/v2/fetch_search_videos",
}

export const tikhub_wechat_search_videos: ToolDefinition = {
  name: "tikhub_wechat_search_videos",
  display_name: {
    en_US: "WeChat Search · Search Channels Videos",
    zh_Hans: "微信搜一搜 · 搜索视频号视频",
  },
  description: {
    en_US:
      "Search WeChat Channels videos by keyword with duration, sort, publish-time, and cursor pagination filters.",
    zh_Hans: "按关键词搜索视频号视频，支持时长、排序、发布时间和 cursor 翻页。",
  },
  icon: "🔎",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "keyword",
      required: true,
      minLength: 1,
      maxLength: 100,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Required keyword for WeChat Channels video search.",
        zh_Hans: "搜索视频号视频的必填关键词。",
      },
      llmDescription: {
        en_US:
          "Required keyword for the WeChat Channels video search endpoint.",
        zh_Hans: "视频号视频搜索接口使用的必填关键词。",
      },
    }),
    wechatSelectParameter({
      name: "duration",
      values: videoDurationValues,
      default: "all",
      displayName: { en_US: "Duration", zh_Hans: "时长" },
      hint: {
        en_US: "Use all, short, medium, or long.",
        zh_Hans: "使用 all、short、medium、long。",
      },
      llmDescription: {
        en_US:
          "Duration filter. Must be one of all, short, medium, long. Use string keys, not numeric aliases.",
        zh_Hans:
          "时长筛选。必须为 all、short、medium、long 之一，使用字符串键，不要使用数字别名。",
      },
    }),
    wechatSelectParameter({
      name: "sort",
      values: searchSortValues,
      default: "default",
      displayName: { en_US: "Sort", zh_Hans: "排序" },
      hint: {
        en_US: "Use default, latest, or hot.",
        zh_Hans: "使用 default、latest、hot。",
      },
      llmDescription: {
        en_US:
          "Sort order. Must be one of default, latest, hot. Keep it unchanged when paginating.",
        zh_Hans: "排序方式。必须为 default、latest、hot 之一。翻页时保持不变。",
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
          "Publish time filter. Must be one of all, day, week, half_year. Keep it unchanged when paginating.",
        zh_Hans:
          "发布时间筛选。必须为 all、day、week、half_year 之一。翻页时保持不变。",
      },
    }),
    wechatIntegerParameter({
      name: "offset",
      default: 0,
      min: 0,
      displayName: { en_US: "Offset", zh_Hans: "Offset" },
      hint: {
        en_US:
          "OpenAPI default 0. Offset alone does not paginate; use cursor for next pages.",
        zh_Hans: "OpenAPI 默认 0。单独 offset 不能翻页；后续页请使用 cursor。",
      },
      llmDescription: {
        en_US:
          "First-page offset, default 0. Real pagination requires the previous response cursor.",
        zh_Hans: "首次请求 offset，默认 0。真正翻页需要上次响应的 cursor。",
      },
    }),
    wechatStringParameter({
      name: "cursor",
      required: false,
      displayName: { en_US: "Cursor", zh_Hans: "分页 cursor" },
      hint: {
        en_US:
          "Leave empty for first page. Pass the returned cursor unchanged for the next page.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 cursor。",
      },
      llmDescription: {
        en_US:
          "Opaque video search pagination cursor. Do not parse or rewrite it. exportId and feedNonceId from results must be treated as strings.",
        zh_Hans:
          "视频搜索不透明分页 cursor，不要解析或改写。结果中的 exportId 和 feedNonceId 必须按字符串处理。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      keyword: readRequiredConstrainedStringParam(p, "keyword", {
        label: "keyword",
        minLength: 1,
        maxLength: 100,
        example: "美食",
      }),
      duration: readOptionalStringParam(p, "duration") ?? "all",
      sort: readOptionalStringParam(p, "sort") ?? "default",
      publish_time: readOptionalStringParam(p, "publish_time") ?? "all",
      offset: readOptionalIntegerParam(p, "offset") ?? 0,
      cursor: readOptionalStringParam(p, "cursor"),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
