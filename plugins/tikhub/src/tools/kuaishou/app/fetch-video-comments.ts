import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  pcursorParameter,
  readOpaqueCursor,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_video_comment",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_video_comment",
}

export const tikhub_kuaishou_video_comments: ToolDefinition = {
  name: "tikhub_kuaishou_video_comments",
  display_name: {
    en_US: "Kuaishou · Video Comments",
    zh_Hans: "快手 · 作品评论",
  },
  description: {
    en_US: "Fetch first-level comments for a Kuaishou post.",
    zh_Hans: "获取快手作品的一级评论。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "photo_id",
      required: true,
      displayName: { en_US: "Photo ID", zh_Hans: "作品 ID" },
      hint: {
        en_US: "Required numeric photoId or short eID. Keep it as a string.",
        zh_Hans: "必填数字 photoId 或短字符串 eID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Kuaishou photo ID. Never convert long numeric IDs to JavaScript numbers.",
        zh_Hans: "必填快手作品 ID。不要把长数字 ID 转成 JavaScript number。",
      },
      placeholder: { en_US: "3x7gxp2zhgjv832", zh_Hans: "3x7gxp2zhgjv832" },
    }),
    pcursorParameter(false),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      photo_id: readRequiredString(p, "photo_id"),
      pcursor: readOpaqueCursor(p),
    })
  },
}
