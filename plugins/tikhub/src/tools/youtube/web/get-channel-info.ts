import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  channelIdParameter,
  credentialParameter,
  invokeYouTubeGet,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_channel_info",
  method: "GET",
  path: "/api/v1/youtube/web/get_channel_info",
}

export const tikhub_youtube_channel_info: ToolDefinition = {
  name: "tikhub_youtube_channel_info",
  display_name: {
    en_US: "YouTube · Get Channel Info",
    zh_Hans: "YouTube · 获取频道资料",
  },
  description: {
    en_US:
      "Get full YouTube channel profile data for channel profiling, influence analysis, and competitor research.",
    zh_Hans: "获取 YouTube 频道完整资料，用于频道画像、影响力和竞对分析。",
  },
  icon: "▶️",
  parameters: [credentialParameter, channelIdParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      channel_id: readRequiredStringParam(p, "channel_id"),
    })
  },
}
