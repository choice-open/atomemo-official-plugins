import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  continuationTokenParameter,
  credentialParameter,
  invokeYouTubeGet,
  keywordParameter,
  needFormatParameter,
  readKeywordOrContinuation,
  readOptionalBooleanParam,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "search_channels",
  method: "GET",
  path: "/api/v1/youtube/web_v2/search_channels",
}

export const tikhub_youtube_search_channels: ToolDefinition = {
  name: "tikhub_youtube_search_channels",
  display_name: {
    en_US: "YouTube · Search Channels",
    zh_Hans: "YouTube · 搜索频道",
  },
  description: {
    en_US:
      "Search YouTube channels by keyword, with continuation pagination for prospecting and competitor discovery.",
    zh_Hans:
      "按关键词搜索 YouTube 频道，支持 continuation 翻页，用于潜客和竞对发现。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    keywordParameter,
    continuationTokenParameter,
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const paging = readKeywordOrContinuation(p)
    return invokeYouTubeGet(endpoint, args, {
      ...paging,
      need_format: readOptionalBooleanParam(p, "need_format") ?? "true",
    })
  },
}
