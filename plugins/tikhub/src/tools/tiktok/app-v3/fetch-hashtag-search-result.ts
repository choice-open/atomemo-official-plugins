import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  invokeTikTokGet,
  keywordParameter,
  offsetParameter,
  readOptionalIntegerParam,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_hashtag_search_result",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_hashtag_search_result",
}

export const tikhub_tiktok_fetch_hashtag_search_result: ToolDefinition = {
  name: "tikhub_tiktok_fetch_hashtag_search_result",
  display_name: {
    en_US: "TikTok · Hashtag Search",
    zh_Hans: "TikTok · 获取话题搜索结果",
  },
  description: {
    en_US: "Get TikTok hashtag search results by keyword.",
    zh_Hans: "根据关键词获取 TikTok 话题搜索结果。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    keywordParameter,
    offsetParameter,
    countParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      keyword: readRequiredStringParam(p, "keyword"),
      offset: readOptionalIntegerParam(p, "offset"),
      count: readOptionalIntegerParam(p, "count"),
    })
  },
}
