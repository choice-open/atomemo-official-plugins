import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeYouTubeGet,
  keywordParameter,
  readKeywordOrContinuation,
  readOptionalStringParam,
  searchContinuationTokenParameter,
  searchRequestModeParameter,
  sortByValues,
  uploadDateValues,
  youtubeSelectParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_shorts_search_v2",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_shorts_search_v2",
}

export const tikhub_youtube_shorts_search_v2: ToolDefinition = {
  name: "tikhub_youtube_shorts_search_v2",
  display_name: {
    en_US: "YouTube · Shorts Search V2",
    zh_Hans: "YouTube · Shorts 搜索 V2",
  },
  description: {
    en_US:
      "Search YouTube Shorts by keyword for short-form social listening, with filters and continuation pagination.",
    zh_Hans:
      "按关键词搜索 YouTube Shorts，用于短视频舆情监测，支持过滤和 continuation 翻页。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    searchRequestModeParameter,
    keywordParameter,
    searchContinuationTokenParameter,
    youtubeSelectParameter({
      name: "upload_date",
      values: uploadDateValues,
      displayName: { en_US: "Upload Date", zh_Hans: "上传时间" },
      hint: {
        en_US:
          "Optional upload date filter: last_hour, today, this_week, this_month, this_year.",
        zh_Hans:
          "可选上传时间过滤：last_hour、today、this_week、this_month、this_year。",
      },
      llmDescription: {
        en_US:
          "Upload date filter for Shorts search. Valid values: last_hour, today, this_week, this_month, this_year.",
        zh_Hans:
          "Shorts 搜索上传时间过滤。有效值：last_hour、today、this_week、this_month、this_year。",
      },
    }),
    youtubeSelectParameter({
      name: "sort_by",
      values: sortByValues,
      displayName: { en_US: "Sort By", zh_Hans: "排序方式" },
      hint: {
        en_US: "Optional sort: relevance, upload_date, view_count, rating.",
        zh_Hans: "可选排序：relevance、upload_date、view_count、rating。",
      },
      llmDescription: {
        en_US:
          "Sort order for Shorts search. Valid values from TikHub OpenAPI: relevance, upload_date, view_count, rating.",
        zh_Hans:
          "Shorts 搜索排序方式。TikHub OpenAPI 有效值：relevance、upload_date、view_count、rating。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const paging = readKeywordOrContinuation(p)
    return invokeYouTubeGet(endpoint, args, {
      ...paging,
      upload_date: readOptionalStringParam(p, "upload_date"),
      sort_by: readOptionalStringParam(p, "sort_by"),
    })
  },
}
