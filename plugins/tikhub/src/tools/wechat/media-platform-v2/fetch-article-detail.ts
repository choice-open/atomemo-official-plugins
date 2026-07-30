import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_article_detail",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_article_detail",
}

export const tikhub_wechat_mp_article_detail: ToolDefinition = {
  name: "tikhub_wechat_mp_article_detail",
  display_name: {
    en_US: "WeChat Official Account · Get Article Detail",
    zh_Hans: "微信公众号 · 获取文章详情",
  },
  description: {
    en_US:
      "Get WeChat official account article body and metadata by article URL.",
    zh_Hans: "根据公众号文章 URL 获取正文详情和元数据。",
  },
  icon: "📄",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "url",
      required: true,
      displayName: { en_US: "Article URL", zh_Hans: "文章 URL" },
      hint: {
        en_US:
          "Required mp.weixin.qq.com/s/... URL or a long URL containing __biz.",
        zh_Hans: "必填 mp.weixin.qq.com/s/... 链接或带 __biz 的长链接。",
      },
      llmDescription: {
        en_US:
          "WeChat official account article URL, either mp.weixin.qq.com/s/... or a long URL with __biz.",
        zh_Hans:
          "微信公众号文章链接，可为 mp.weixin.qq.com/s/... 或带 __biz 的长链接。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      url: readOptionalStringParam(p, "url"),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
