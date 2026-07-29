import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  countryCodeUsParameter,
  credentialParameter,
  invokeYouTubeGet,
  languageCodeZhParameter,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  youtubeStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "get_video_comment_replies",
  method: "GET",
  path: "/api/v1/youtube/web_v2/get_video_comment_replies",
}

export const tikhub_youtube_comment_replies: ToolDefinition = {
  name: "tikhub_youtube_comment_replies",
  display_name: {
    en_US: "YouTube · Get Comment Replies",
    zh_Hans: "YouTube · 获取评论回复",
  },
  description: {
    en_US:
      "Get second-level YouTube comment replies using the reply continuation token returned by first-level comments.",
    zh_Hans:
      "使用一级评论返回的回复 continuation token 获取 YouTube 二级评论。",
  },
  icon: "▶️",
  parameters: [
    credentialParameter,
    youtubeStringParameter({
      name: "continuation_token",
      required: true,
      displayName: {
        en_US: "Reply Continuation Token",
        zh_Hans: "回复分页 Token",
      },
      hint: {
        en_US:
          "Required opaque reply token from reply_continuation_token in a first-level comment response.",
        zh_Hans: "必填。从一级评论响应的 reply_continuation_token 原样复制。",
      },
      llmDescription: {
        en_US:
          "Required reply continuation token from first-level comments. Pass it exactly as returned; do not parse or modify it.",
        zh_Hans:
          "一级评论返回的回复 continuation token，必填。必须原样传入，不要解析或修改。",
      },
      placeholder: {
        en_US: "reply_continuation_token",
        zh_Hans: "reply_continuation_token",
      },
    }),
    languageCodeZhParameter,
    countryCodeUsParameter,
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeYouTubeGet(endpoint, args, {
      continuation_token: readRequiredStringParam(p, "continuation_token"),
      language_code: readOptionalStringParam(p, "language_code") ?? "zh-CN",
      country_code: readOptionalStringParam(p, "country_code") ?? "US",
      need_format: readOptionalBooleanParam(p, "need_format") ?? "true",
    })
  },
}
