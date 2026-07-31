import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouIntegerParameter,
  kuaishouStringParameter,
  pcursorParameter,
  readInteger,
  readOpaqueCursor,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_video_sub_comments",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_video_sub_comments",
}

export const tikhub_kuaishou_comment_replies: ToolDefinition = {
  name: "tikhub_kuaishou_comment_replies",
  display_name: {
    en_US: "Kuaishou · Comment Replies",
    zh_Hans: "快手 · 评论回复",
  },
  description: {
    en_US: "Fetch second-level replies under a Kuaishou root comment.",
    zh_Hans: "获取快手一级评论下的二级回复。",
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
          "Required photo ID. Never convert long IDs to JavaScript numbers.",
        zh_Hans: "必填作品 ID。不要把长 ID 转成 JavaScript number。",
      },
      placeholder: {
        en_US: "5218546261880462502",
        zh_Hans: "5218546261880462502",
      },
    }),
    kuaishouStringParameter({
      name: "root_comment_id",
      required: true,
      displayName: { en_US: "Root Comment ID", zh_Hans: "一级评论 ID" },
      hint: {
        en_US: "Required root comment ID. Keep long IDs as strings.",
        zh_Hans: "必填一级评论 ID。长 ID 按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required root comment ID. Never convert it to a JavaScript number.",
        zh_Hans: "必填一级评论 ID。不要转成 JavaScript number。",
      },
      placeholder: { en_US: "14000000123456789", zh_Hans: "14000000123456789" },
    }),
    pcursorParameter(),
    kuaishouIntegerParameter({
      name: "count",
      default: 8,
      minimum: 1,
      maximum: 20,
      displayName: { en_US: "Page Size", zh_Hans: "每页数量" },
      hint: {
        en_US: "OpenAPI default 8; allowed range 1-20.",
        zh_Hans: "OpenAPI 默认 8；允许范围 1-20。",
      },
      llmDescription: {
        en_US: "Reply count from 1 through 20. Default 8.",
        zh_Hans: "评论回复数量，范围 1-20，默认 8。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      photo_id: readRequiredString(p, "photo_id"),
      root_comment_id: readRequiredString(p, "root_comment_id"),
      pcursor: readOpaqueCursor(p),
      count: String(readInteger(p, "count", 8, { minimum: 1, maximum: 20 })),
    })
  },
}
