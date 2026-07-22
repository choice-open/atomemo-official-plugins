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
  id: "fetch_video_comment_replies",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_video_comment_replies",
}

export const tikhub_tiktok_fetch_video_comment_replies: ToolDefinition = {
  name: "tikhub_tiktok_fetch_video_comment_replies",
  display_name: {
    en_US: "TikTok · Get Comment Replies",
    zh_Hans: "TikTok · 获取指定视频的评论回复数据",
  },
  description: {
    en_US:
      "Get replies to a specific TikTok video comment. Supports pagination.",
    zh_Hans: "获取 TikTok 指定视频评论的回复数据，支持分页。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "item_id",
      required: true,
      displayName: { en_US: "Video ID", zh_Hans: "视频ID" },
      description: {
        en_US: "TikTok video/item ID that contains the comment.",
        zh_Hans: "包含该评论的 TikTok 作品/视频ID。",
      },
      hint: { en_US: "TikTok item ID.", zh_Hans: "TikTok 作品ID。" },
      placeholder: { en_US: "Video ID", zh_Hans: "视频ID" },
    }),
    stringParameter({
      name: "comment_id",
      required: true,
      displayName: { en_US: "Comment ID", zh_Hans: "评论ID" },
      description: {
        en_US: "The comment ID to fetch replies for.",
        zh_Hans: "要获取回复的评论ID。",
      },
      hint: { en_US: "TikTok comment ID.", zh_Hans: "TikTok 评论ID。" },
      placeholder: { en_US: "Comment ID", zh_Hans: "评论ID" },
    }),
    cursorParameter,
    countParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      item_id: readRequiredStringParam(p, "item_id"),
      comment_id: readRequiredStringParam(p, "comment_id"),
      cursor: readOptionalIntegerParam(p, "cursor"),
      count: readOptionalIntegerParam(p, "count"),
    })
  },
}
