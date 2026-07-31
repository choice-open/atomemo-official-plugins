import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readRequiredConstrainedStringParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_article_stats",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_article_stats",
}

export const tikhub_wechat_mp_article_stats: ToolDefinition = {
  name: "tikhub_wechat_mp_article_stats",
  display_name: {
    en_US: "WeChat Official Account · Get Article Stats",
    zh_Hans: "微信公众号 · 获取互动数据",
  },
  description: {
    en_US:
      "Get read, like, wow, and other interaction statistics for a WeChat official account article.",
    zh_Hans: "获取公众号文章阅读、点赞、在看等互动统计数据。",
  },
  icon: "📊",
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
          "WeChat official account article URL for interaction statistics.",
        zh_Hans: "用于获取互动数据的微信公众号文章链接。",
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
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
