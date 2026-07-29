import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeYouTubeGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readVideoIdOrUrl,
  videoIdParameter,
  videoUrlParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_video_info_v2",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_video_info_v2",
}

export const tikhub_youtube_video_info_v2: ToolDefinition = {
  name: "tikhub_youtube_video_info_v2",
  display_name: {
    en_US: "YouTube · Get Video Info V2",
    zh_Hans: "YouTube · 获取视频详情 V2",
  },
  description: {
    en_US:
      "Get YouTube video metadata such as title, description, author, publish time, and engagement metrics.",
    zh_Hans: "获取 YouTube 视频标题、描述、作者、发布时间和互动指标等元数据。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    videoIdParameter,
    videoUrlParameter,
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      ...readVideoIdOrUrl(p),
      need_format: readOptionalBooleanParam(p, "need_format") ?? "true",
    })
  },
}
