import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  advancedIncludeTypeValues,
  advancedSearchTypeValues,
  credentialParameter,
  invokeWeiboGet,
  pageParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  weiboSelectParameter,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_advanced_search",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_advanced_search",
}

export const tikhub_weibo_advanced_search: ToolDefinition = {
  name: "tikhub_weibo_advanced_search",
  display_name: {
    en_US: "Weibo · Advanced Search",
    zh_Hans: "微博 · 高级搜索",
  },
  description: {
    en_US:
      "Search Weibo by keyword with type, media, time-scope, and page filters for social listening.",
    zh_Hans: "按关键词高级搜索微博，支持类型、媒体、时间范围和页码筛选。",
  },
  icon: "🔎",
  parameters: [
    credentialParameter,
    weiboStringParameter({
      name: "q",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Required Weibo search keyword.",
        zh_Hans: "必填微博搜索关键词。",
      },
      llmDescription: {
        en_US: "Required keyword used for Weibo advanced search.",
        zh_Hans: "微博高级搜索使用的必填关键词。",
      },
      placeholder: { en_US: "AI product launch", zh_Hans: "AI 产品发布" },
    }),
    weiboSelectParameter({
      name: "search_type",
      values: advancedSearchTypeValues,
      displayName: { en_US: "Search Type", zh_Hans: "搜索类型" },
      hint: {
        en_US: "Optional: all, hot, original, verified, media, or viewpoint.",
        zh_Hans: "可选：all、hot、original、verified、media、viewpoint。",
      },
      llmDescription: {
        en_US:
          "Search type. Valid values: all, hot, original, verified, media, viewpoint.",
        zh_Hans:
          "搜索类型。有效值：all、hot、original、verified、media、viewpoint。",
      },
    }),
    weiboSelectParameter({
      name: "include_type",
      values: advancedIncludeTypeValues,
      displayName: { en_US: "Include Type", zh_Hans: "包含类型" },
      hint: {
        en_US: "Optional: all, pic, video, music, or link.",
        zh_Hans: "可选：all、pic、video、music、link。",
      },
      llmDescription: {
        en_US:
          "Included content type. Valid values: all, pic, video, music, link.",
        zh_Hans: "包含内容类型。有效值：all、pic、video、music、link。",
      },
    }),
    weiboStringParameter({
      name: "timescope",
      required: false,
      displayName: { en_US: "Time Scope", zh_Hans: "时间范围" },
      hint: {
        en_US: "Optional format: custom:start-date-hour:end-date-hour.",
        zh_Hans: "可选格式：custom:开始日期小时:结束日期小时。",
      },
      llmDescription: {
        en_US:
          "Optional Weibo time scope string. Keep the upstream format, for example custom:start-date-hour:end-date-hour.",
        zh_Hans:
          "可选微博时间范围字符串。保持上游格式，例如 custom:开始日期小时:结束日期小时。",
      },
    }),
    pageParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      q: readOptionalStringParam(p, "q"),
      search_type: readOptionalStringParam(p, "search_type"),
      include_type: readOptionalStringParam(p, "include_type"),
      timescope: readOptionalStringParam(p, "timescope"),
      page: readOptionalIntegerParam(p, "page") ?? "1",
    })
  },
}
