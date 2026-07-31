import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalConstrainedStringParam,
  readOptionalIntegerParam,
  readRequiredConstrainedStringParam,
  wechatBooleanParameter,
  wechatIntegerParameter,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_comment_replies",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_comment_replies",
}

export const tikhub_wechat_mp_comment_replies: ToolDefinition = {
  name: "tikhub_wechat_mp_comment_replies",
  display_name: {
    en_US: "WeChat Official Account · Get Comment Replies",
    zh_Hans: "微信公众号 · 获取评论回复",
  },
  description: {
    en_US:
      "Fetch replies for a WeChat official account article comment, optionally using upstream automatic comment selection.",
    zh_Hans: "获取公众号文章评论回复，可沿用上游自动选择有回复评论的行为。",
  },
  icon: "💬",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "url",
      required: true,
      maxLength: 2048,
      pattern: "^https?://mp\\.weixin\\.qq\\.com/s([/?].+)?$",
      displayName: { en_US: "Article URL", zh_Hans: "文章 URL" },
      hint: {
        en_US: "Required WeChat official account article URL.",
        zh_Hans: "必填微信公众号文章链接。",
      },
      llmDescription: {
        en_US:
          "WeChat official account article URL used to fetch comment replies.",
        zh_Hans: "用于获取评论回复的微信公众号文章链接。",
      },
    }),
    wechatStringParameter({
      name: "content_id",
      default: "",
      maxLength: 32,
      pattern: "^[0-9]*$",
      displayName: { en_US: "Content ID", zh_Hans: "评论 content_id" },
      hint: {
        en_US:
          "Optional first-level comment content_id. Leave empty to let TikHub choose the first comment with replies.",
        zh_Hans:
          "可选一级评论 content_id。留空时由 TikHub 自动选择第一条有回复的评论。",
      },
      llmDescription: {
        en_US:
          "Optional first-level comment content_id. Treat as a string. Empty keeps TikHub's automatic first-comment-with-replies behavior.",
        zh_Hans:
          "可选一级评论 content_id。按字符串处理。为空时沿用 TikHub 自动选择第一条有回复评论的行为。",
      },
    }),
    wechatIntegerParameter({
      name: "offset",
      default: 0,
      min: 0,
      displayName: { en_US: "Offset", zh_Hans: "Offset" },
      hint: {
        en_US: "OpenAPI default 0. When has_more is true, pass next_offset.",
        zh_Hans: "OpenAPI 默认 0。has_more=true 时传入 next_offset。",
      },
      llmDescription: {
        en_US:
          "Reply pagination offset. Default 0. When the previous response has has_more=true, pass next_offset.",
        zh_Hans:
          "回复翻页 offset，默认 0。上次响应 has_more=true 时传入 next_offset。",
      },
    }),
    wechatBooleanParameter({
      name: "all_pages",
      default: false,
      displayName: { en_US: "Fetch All Pages", zh_Hans: "获取全部页" },
      hint: {
        en_US:
          "OpenAPI default false. True ignores offset and may increase latency and API cost.",
        zh_Hans:
          "OpenAPI 默认 false。true 会忽略 offset，可能增加耗时和 API 成本。",
      },
      llmDescription: {
        en_US:
          "When true, ignore offset and fetch all replies. This can increase response time and TikHub API cost.",
        zh_Hans:
          "为 true 时忽略 offset 并获取全部回复。这可能增加响应耗时和 TikHub API 成本。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      url: readRequiredConstrainedStringParam(p, "url", {
        label: "article URL",
        maxLength: 2048,
        pattern: /^https?:\/\/mp\.weixin\.qq\.com\/s([/?].+)?$/,
        example:
          "http://mp.weixin.qq.com/s?__biz=Mzk3NTA0MzM5NA==&mid=2247483745&idx=1&sn=3f34e768cf457a501038991ed30be1f4#rd",
      }),
      content_id:
        readOptionalConstrainedStringParam(p, "content_id", {
          label: "content_id",
          maxLength: 32,
          pattern: /^[0-9]*$/,
        }) ?? "",
      offset: readOptionalIntegerParam(p, "offset") ?? 0,
      all_pages: readOptionalBooleanParam(p, "all_pages") ?? false,
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
