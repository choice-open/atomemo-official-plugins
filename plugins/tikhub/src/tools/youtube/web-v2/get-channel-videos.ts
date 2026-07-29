import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  channelIdParameter,
  continuationTokenParameter,
  countryCodeUsParameter,
  credentialParameter,
  invokeYouTubeGet,
  languageCodeZhParameter,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_channel_videos",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_channel_videos",
}

export const tikhub_youtube_channel_videos: ToolDefinition = {
  name: "tikhub_youtube_channel_videos",
  display_name: {
    en_US: "YouTube · Get Channel Videos",
    zh_Hans: "YouTube · 获取频道视频",
  },
  description: {
    en_US:
      "Get historical YouTube channel video metadata with localization and continuation pagination.",
    zh_Hans:
      "获取 YouTube 频道历史视频元数据，支持本地化和 continuation 翻页。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    channelIdParameter,
    languageCodeZhParameter,
    countryCodeUsParameter,
    continuationTokenParameter,
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      channel_id: readRequiredStringParam(p, "channel_id"),
      language_code: readOptionalStringParam(p, "language_code") ?? "zh-CN",
      country_code: readOptionalStringParam(p, "country_code") ?? "US",
      continuation_token: readOptionalStringParam(p, "continuation_token"),
      need_format: readOptionalBooleanParam(p, "need_format") ?? "true",
    })
  },
}
