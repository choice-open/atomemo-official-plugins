import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  cursorParameter,
  invokeTikTokGet,
  readOptionalIntegerParam,
  stringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_video_comments",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_video_comments",
}

export const tikhub_tiktok_fetch_video_comments: ToolDefinition = {
  name: "tikhub_tiktok_fetch_video_comments",
  display_name: {
    en_US: "TikTok · Get Video Comments",
    zh_Hans: "TikTok · 获取单个视频评论数据",
  },
  description: {
    en_US: "Get comments for a single TikTok video. Supports pagination.",
    zh_Hans: "获取 TikTok 单个视频评论数据，支持分页。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "aweme_id",
      required: true,
      displayName: { en_US: "Video ID", zh_Hans: "视频ID" },
      description: {
        en_US: "TikTok video/aweme ID to fetch comments for.",
        zh_Hans: "要获取评论的 TikTok 作品/视频ID。",
      },
      hint: {
        en_US: "TikTok video ID (aweme_id).",
        zh_Hans: "TikTok 作品ID。",
      },
      placeholder: { en_US: "Video ID", zh_Hans: "视频ID" },
    }),
    cursorParameter,
    countParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      aweme_id: readRequiredStringParam(p, "aweme_id"),
      cursor: readOptionalIntegerParam(p, "cursor"),
      count: readOptionalIntegerParam(p, "count"),
    })
  },
}
