import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  commentSortValues,
  continuationTokenParameter,
  countryCodeUsParameter,
  credentialParameter,
  invokeYouTubeGet,
  languageCodeZhParameter,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  youtubeSelectParameter,
  youtubeStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_video_comments",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_video_comments",
}

export const tikhub_youtube_video_comments: ToolDefinition = {
  name: "tikhub_youtube_video_comments",
  display_name: {
    en_US: "YouTube · Get Video Comments",
    zh_Hans: "YouTube · 获取视频评论",
  },
  description: {
    en_US:
      "Get first-level YouTube video comments with sorting, localization, and continuation pagination.",
    zh_Hans:
      "获取 YouTube 视频一级评论，支持排序、本地化和 continuation 翻页。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    youtubeStringParameter({
      name: "video_id",
      required: true,
      displayName: { en_US: "Video ID", zh_Hans: "视频 ID" },
      hint: {
        en_US: "11-character YouTube video ID.",
        zh_Hans: "11 位 YouTube 视频 ID。",
      },
      llmDescription: {
        en_US:
          "YouTube video ID used to fetch first-level comments. Pass it as a string.",
        zh_Hans: "用于获取一级评论的 YouTube 视频 ID。请以字符串传递。",
      },
      placeholder: { en_US: "dQw4w9WgXcQ", zh_Hans: "dQw4w9WgXcQ" },
    }),
    languageCodeZhParameter,
    countryCodeUsParameter,
    youtubeSelectParameter({
      name: "sort_by",
      values: commentSortValues,
      default: "top",
      displayName: { en_US: "Sort By", zh_Hans: "排序方式" },
      hint: {
        en_US: "Default top. Valid values: top, newest.",
        zh_Hans: "默认 top。有效值：top、newest。",
      },
      llmDescription: {
        en_US:
          "Comment sorting. TikHub OpenAPI enum values are top and newest; default is top.",
        zh_Hans: "评论排序。TikHub OpenAPI 枚举为 top 和 newest；默认 top。",
      },
    }),
    continuationTokenParameter,
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      video_id: readRequiredStringParam(p, "video_id"),
      language_code: readOptionalStringParam(p, "language_code") ?? "zh-CN",
      country_code: readOptionalStringParam(p, "country_code") ?? "US",
      sort_by: readOptionalStringParam(p, "sort_by") ?? "top",
      continuation_token: readOptionalStringParam(p, "continuation_token"),
      need_format: readOptionalBooleanParam(p, "need_format") ?? "true",
    })
  },
}
