import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliIntegerParameter,
  bvIdParameter,
  credentialParameter,
  invokeBilibiliGet,
  readPageNumber,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_video_comments",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_video_comments",
}

export const tikhub_bilibili_video_comments: ToolDefinition = {
  name: "tikhub_bilibili_video_comments",
  display_name: {
    en_US: "Bilibili · Video Comments",
    zh_Hans: "哔哩哔哩 · 视频评论",
  },
  description: {
    en_US: "Fetch first-level comments for a known Bilibili video.",
    zh_Hans: "获取已知 Bilibili 视频的一级评论。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    bvIdParameter,
    bilibiliIntegerParameter({
      name: "pn",
      default: 1,
      minimum: 1,
      displayName: { en_US: "Page Number", zh_Hans: "页码" },
      hint: {
        en_US: "OpenAPI default 1.",
        zh_Hans: "OpenAPI 默认 1。",
      },
      llmDescription: {
        en_US: "Comments page number. OpenAPI default is 1.",
        zh_Hans: "评论页码。OpenAPI 默认 1。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      bv_id: readTrimmedRequired(p, "bv_id", "bv_id"),
      pn: String(readPageNumber(p)),
    })
  },
}
