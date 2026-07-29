import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  contentTypeValues,
  continuationTokenParameter,
  credentialParameter,
  durationValues,
  invokeYouTubeGet,
  keywordParameter,
  readKeywordOrContinuation,
  readOptionalStringParam,
  sortByValues,
  uploadDateValues,
  youtubeSelectParameter,
  youtubeStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_general_search_v2",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_general_search_v2",
}

export const tikhub_youtube_general_search_v2: ToolDefinition = {
  name: "tikhub_youtube_general_search_v2",
  display_name: {
    en_US: "YouTube · General Search V2",
    zh_Hans: "YouTube · 综合搜索 V2",
  },
  description: {
    en_US:
      "Search YouTube videos, channels, playlists, and movies by keyword with filters and continuation pagination.",
    zh_Hans:
      "按关键词搜索 YouTube 视频、频道、播放列表和电影，支持过滤条件和 continuation 翻页。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    keywordParameter,
    continuationTokenParameter,
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
          "Upload date filter. Valid values from TikHub OpenAPI: last_hour, today, this_week, this_month, this_year.",
        zh_Hans:
          "上传时间过滤。TikHub OpenAPI 有效值：last_hour、today、this_week、this_month、this_year。",
      },
    }),
    youtubeSelectParameter({
      name: "type",
      values: contentTypeValues,
      displayName: { en_US: "Content Type", zh_Hans: "内容类型" },
      hint: {
        en_US: "Optional type filter: video, channel, playlist, movie.",
        zh_Hans: "可选类型过滤：video、channel、playlist、movie。",
      },
      llmDescription: {
        en_US:
          "Type filter. Valid values from TikHub OpenAPI: video, channel, playlist, movie.",
        zh_Hans:
          "类型过滤。TikHub OpenAPI 有效值：video、channel、playlist、movie。",
      },
    }),
    youtubeSelectParameter({
      name: "duration",
      values: durationValues,
      displayName: { en_US: "Duration", zh_Hans: "时长" },
      hint: {
        en_US:
          "Optional duration filter: short (<4m), medium (4-20m), long (>20m).",
        zh_Hans:
          "可选时长过滤：short（4 分钟内）、medium（4-20 分钟）、long（20 分钟以上）。",
      },
      llmDescription: {
        en_US:
          "Duration filter. Valid values: short for under 4 minutes, medium for 4-20 minutes, long for over 20 minutes.",
        zh_Hans:
          "时长过滤。有效值：short 小于 4 分钟，medium 为 4-20 分钟，long 大于 20 分钟。",
      },
    }),
    youtubeStringParameter({
      name: "features",
      required: false,
      displayName: { en_US: "Features", zh_Hans: "特性过滤" },
      hint: {
        en_US:
          "Comma-separated features: live, 4k, hd, subtitles, creative_commons, 360, vr180, 3d, hdr.",
        zh_Hans:
          "逗号分隔特性：live、4k、hd、subtitles、creative_commons、360、vr180、3d、hdr。",
      },
      llmDescription: {
        en_US:
          "Optional comma-separated YouTube feature filter. Pass only valid values from the OpenAPI description.",
        zh_Hans:
          "可选的 YouTube 特性过滤，用逗号分隔。仅传 OpenAPI 描述列出的有效值。",
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
          "Sort order. Valid values from TikHub OpenAPI: relevance, upload_date, view_count, rating.",
        zh_Hans:
          "排序方式。TikHub OpenAPI 有效值：relevance、upload_date、view_count、rating。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const paging = readKeywordOrContinuation(p)
    return invokeYouTubeGet(endpoint, args, {
      ...paging,
      upload_date: readOptionalStringParam(p, "upload_date"),
      type: readOptionalStringParam(p, "type"),
      duration: readOptionalStringParam(p, "duration"),
      features: readOptionalStringParam(p, "features"),
      sort_by: readOptionalStringParam(p, "sort_by"),
    })
  },
}
