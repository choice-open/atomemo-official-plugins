import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeYouTubeGet,
  readOptionalStringParam,
  trendingSectionValues,
  youtubeSelectParameter,
  youtubeStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_trending_videos",
  method: "GET",
  path: "/api/v1/youtube/web/get_trending_videos",
}

export const tikhub_youtube_trending_videos: ToolDefinition = {
  name: "tikhub_youtube_trending_videos",
  display_name: {
    en_US: "YouTube · Get Trending Videos",
    zh_Hans: "YouTube · 获取趋势视频",
  },
  description: {
    en_US:
      "Get YouTube trending videos by language, country, and section for regional trend monitoring.",
    zh_Hans: "按语言、国家和分区获取 YouTube 趋势视频，用于地区趋势监测。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    youtubeStringParameter({
      name: "language_code",
      required: false,
      default: "en",
      displayName: { en_US: "Language Code", zh_Hans: "语言代码" },
      hint: {
        en_US: "Language code. TikHub default is en.",
        zh_Hans: "语言代码。TikHub 默认值为 en。",
      },
      llmDescription: {
        en_US:
          "Optional language code for YouTube trending videos. Default is en.",
        zh_Hans: "YouTube 趋势视频语言代码，可选。默认 en。",
      },
      placeholder: { en_US: "en", zh_Hans: "en" },
    }),
    youtubeStringParameter({
      name: "country_code",
      required: false,
      default: "us",
      displayName: { en_US: "Country Code", zh_Hans: "国家代码" },
      hint: {
        en_US: "Country code. TikHub default is us.",
        zh_Hans: "国家代码。TikHub 默认值为 us。",
      },
      llmDescription: {
        en_US:
          "Optional country code for regional trending videos. Default is us.",
        zh_Hans: "地区趋势视频国家代码，可选。默认 us。",
      },
      placeholder: { en_US: "us", zh_Hans: "us" },
    }),
    youtubeSelectParameter({
      name: "section",
      values: trendingSectionValues,
      default: "Now",
      displayName: { en_US: "Section", zh_Hans: "趋势分区" },
      hint: {
        en_US:
          "Default Now. Valid values from the description: Now, Music, Gaming, Movies.",
        zh_Hans: "默认 Now。描述中的有效值：Now、Music、Gaming、Movies。",
      },
      llmDescription: {
        en_US:
          "Trending section. Default is Now. Description lists optional values Music, Gaming, and Movies; Now is included because it is the schema default.",
        zh_Hans:
          "趋势分区。默认 Now。描述列出 Music、Gaming、Movies；Now 因 schema.default 纳入有效值。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      language_code: readOptionalStringParam(p, "language_code") ?? "en",
      country_code: readOptionalStringParam(p, "country_code") ?? "us",
      section: readOptionalStringParam(p, "section") ?? "Now",
    })
  },
}
