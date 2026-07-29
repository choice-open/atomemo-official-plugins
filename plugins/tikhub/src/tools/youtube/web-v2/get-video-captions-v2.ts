import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  captionFormatValues,
  credentialParameter,
  invokeYouTubeGet,
  readOptionalStringParam,
  readVideoIdOrUrl,
  videoIdParameter,
  videoLookupModeParameter,
  videoUrlParameter,
  youtubeSelectParameter,
  youtubeStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_video_captions_v2",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_video_captions_v2",
}

export const tikhub_youtube_video_captions_v2: ToolDefinition = {
  name: "tikhub_youtube_video_captions_v2",
  display_name: {
    en_US: "YouTube · Get Video Captions V2",
    zh_Hans: "YouTube · 获取视频字幕 V2",
  },
  description: {
    en_US:
      "Get available caption languages or fetch caption text for a selected language and format.",
    zh_Hans: "获取可用字幕语言列表，或按指定语言和格式获取字幕内容。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    videoLookupModeParameter,
    videoIdParameter,
    videoUrlParameter,
    youtubeStringParameter({
      name: "language_code",
      required: false,
      displayName: { en_US: "Language Code", zh_Hans: "字幕语言代码" },
      hint: {
        en_US:
          "Leave empty to list available captions. Set a returned language code, such as en, zh-Hans, or a.en, to fetch captions.",
        zh_Hans:
          "留空返回可用字幕列表。填入返回的语言代码（如 en、zh-Hans、a.en）获取字幕。",
      },
      llmDescription: {
        en_US:
          "Caption language code. Omit it to discover available captions first, then pass one returned code unchanged.",
        zh_Hans:
          "字幕语言代码。先留空发现可用字幕，再原样传入返回的某个代码获取字幕。",
      },
      placeholder: { en_US: "en", zh_Hans: "en" },
    }),
    youtubeSelectParameter({
      name: "format",
      values: captionFormatValues,
      default: "srt",
      displayName: { en_US: "Caption Format", zh_Hans: "字幕格式" },
      hint: {
        en_US: "Default srt. Valid values: srt, xml, json3, txt.",
        zh_Hans: "默认 srt。有效值：srt、xml、json3、txt。",
      },
      llmDescription: {
        en_US:
          "Caption output format. srt keeps timestamps, xml returns raw XML, json3 returns YouTube JSON, txt returns plain text.",
        zh_Hans:
          "字幕输出格式。srt 保留时间轴，xml 返回原始 XML，json3 返回 YouTube JSON，txt 返回纯文本。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      ...readVideoIdOrUrl(p),
      language_code: readOptionalStringParam(p, "language_code"),
      format: readOptionalStringParam(p, "format") ?? "srt",
    })
  },
}
