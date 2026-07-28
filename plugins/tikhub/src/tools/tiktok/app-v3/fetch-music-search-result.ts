import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  integerParameter,
  invokeTikTokGet,
  keywordParameter,
  offsetParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  regionParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_music_search_result",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_music_search_result",
}

export const tikhub_tiktok_fetch_music_search_result: ToolDefinition = {
  name: "tikhub_tiktok_fetch_music_search_result",
  display_name: {
    en_US: "TikTok · Music Search",
    zh_Hans: "TikTok · 获取音乐搜索结果",
  },
  description: {
    en_US: "Get TikTok music search results by keyword.",
    zh_Hans: "根据关键词获取 TikTok 音乐搜索结果。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    keywordParameter,
    offsetParameter,
    countParameter,
    integerParameter({
      name: "filter_by",
      default: 0,
      displayName: { en_US: "Filter By", zh_Hans: "过滤类型" },
      description: {
        en_US: "Filter type, default 0.",
        zh_Hans: "过滤类型，默认 0。",
      },
      hint: { en_US: "Filter type, default 0.", zh_Hans: "过滤类型，默认 0。" },
    }),
    integerParameter({
      name: "sort_type",
      default: 0,
      displayName: { en_US: "Sort Type", zh_Hans: "排序类型" },
      description: {
        en_US: "Sort type, default 0.",
        zh_Hans: "排序类型，默认 0。",
      },
      hint: { en_US: "Sort type, default 0.", zh_Hans: "排序类型，默认 0。" },
    }),
    regionParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      keyword: readRequiredStringParam(p, "keyword"),
      offset: readOptionalIntegerParam(p, "offset"),
      count: readOptionalIntegerParam(p, "count"),
      filter_by: readOptionalIntegerParam(p, "filter_by"),
      sort_type: readOptionalIntegerParam(p, "sort_type"),
      region: readOptionalStringParam(p, "region"),
    })
  },
}
