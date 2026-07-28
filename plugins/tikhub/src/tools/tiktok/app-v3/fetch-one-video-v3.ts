import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  credentialParameter,
  invokeTikTokGet,
  readOptionalStringParam,
  regionParameter,
  stringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_one_video_v3",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_one_video_v3",
}

export const tikhub_tiktok_fetch_one_video_v3: ToolDefinition = {
  name: "tikhub_tiktok_fetch_one_video_v3",
  display_name: {
    en_US: "TikTok · Get Single Video V3",
    zh_Hans: "TikTok · 获取单个作品数据V3",
  },
  description: {
    en_US:
      "Get single TikTok video data V3 by video ID, with optional region parameter.",
    zh_Hans: "通过视频ID获取 TikTok 单个作品数据V3，支持国家/地区参数。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "aweme_id",
      required: true,
      displayName: { en_US: "Video ID", zh_Hans: "视频ID" },
      description: {
        en_US: "TikTok video/aweme ID.",
        zh_Hans: "TikTok 作品/视频ID。",
      },
      hint: {
        en_US: "TikTok video ID (aweme_id).",
        zh_Hans: "TikTok 作品ID。",
      },
      placeholder: { en_US: "Video ID", zh_Hans: "视频ID" },
    }),
    regionParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      aweme_id: readRequiredStringParam(p, "aweme_id"),
      region: readOptionalStringParam(p, "region"),
    })
  },
}
