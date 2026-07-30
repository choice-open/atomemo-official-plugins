import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalConstrainedStringParam,
  readRequiredConstrainedStringParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_article_comments",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_article_comments",
}

export const tikhub_wechat_mp_article_comments: ToolDefinition = {
  name: "tikhub_wechat_mp_article_comments",
  display_name: {
    en_US: "WeChat Official Account · Get Article Comments",
    zh_Hans: "微信公众号 · 获取文章评论",
  },
  description: {
    en_US:
      "Fetch first-level comments for a WeChat official account article with buffer pagination.",
    zh_Hans: "获取公众号文章一级评论，支持 buffer 翻页。",
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
        en_US: "WeChat official account article URL used to fetch comments.",
        zh_Hans: "用于获取评论的微信公众号文章链接。",
      },
    }),
    wechatStringParameter({
      name: "buffer",
      default: "",
      maxLength: 8192,
      displayName: { en_US: "Buffer", zh_Hans: "分页 buffer" },
      hint: {
        en_US:
          "Leave empty for the first page. Pass the returned buffer unchanged for pagination.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 buffer。",
      },
      llmDescription: {
        en_US:
          "Opaque article comment pagination buffer. Pass it back exactly as returned; do not parse or rewrite.",
        zh_Hans: "文章评论不透明分页 buffer。必须原样传回，不要解析或改写。",
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
        example: "https://mp.weixin.qq.com/s/TSNQKkRpN1qbKsT7BvzqIw",
      }),
      buffer:
        readOptionalConstrainedStringParam(p, "buffer", {
          label: "buffer",
          maxLength: 8192,
        }) ?? "",
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
