import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readOptionalStringParam,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_comment_replies",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_comment_replies",
}

export const tikhub_instagram_comment_replies: ToolDefinition = {
  name: "tikhub_instagram_comment_replies",
  display_name: {
    en_US: "Instagram · Comment Replies",
    zh_Hans: "Instagram · 评论回复",
  },
  description: {
    en_US: "Fetch replies under an Instagram comment.",
    zh_Hans: "获取 Instagram 评论下的回复列表。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "media_id",
      required: true,
      displayName: { en_US: "Media ID", zh_Hans: "媒体 ID" },
      hint: {
        en_US: "Required Instagram media ID. Keep it as a string.",
        zh_Hans: "必填 Instagram 媒体 ID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Instagram post media ID. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Instagram 帖子媒体 ID。按字符串处理，不要转成数字。",
      },
      placeholder: {
        en_US: "3766120364183949816",
        zh_Hans: "3766120364183949816",
      },
    }),
    instagramStringParameter({
      name: "comment_id",
      required: true,
      displayName: { en_US: "Comment ID", zh_Hans: "评论 ID" },
      hint: {
        en_US: "Required parent comment ID. Keep it as a string.",
        zh_Hans: "必填父评论 ID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required parent comment ID for replies. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填父评论 ID。按字符串处理，不要转成数字。",
      },
      placeholder: { en_US: "17871667485468098", zh_Hans: "17871667485468098" },
    }),
    instagramStringParameter({
      name: "min_id",
      displayName: { en_US: "Min ID", zh_Hans: "分页 min_id" },
      hint: {
        en_US:
          "Optional opaque pagination cursor from next_min_id. Pass it unchanged.",
        zh_Hans: "可选不透明分页 cursor，来自 next_min_id，翻页时原样传回。",
      },
      llmDescription: {
        en_US:
          "Opaque replies pagination cursor from next_min_id. Do not parse, decode, or rewrite it.",
        zh_Hans: "回复分页 cursor，来自 next_min_id。不要解析、解码或改写。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      media_id: readTrimmedRequired(p, "media_id", "media_id"),
      comment_id: readTrimmedRequired(p, "comment_id", "comment_id"),
      min_id: readOptionalStringParam(p, "min_id"),
    })
  },
}
