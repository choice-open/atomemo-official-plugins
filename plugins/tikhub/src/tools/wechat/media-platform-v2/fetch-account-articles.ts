import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  articleItemShowTypeValues,
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalConstrainedStringParam,
  readOptionalIntegerParam,
  readOptionalStringParam,
  readOfficialAccountUsername,
  wechatIntegerParameter,
  wechatSelectParameter,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_account_articles",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_account_articles",
}

export const tikhub_wechat_mp_account_articles: ToolDefinition = {
  name: "tikhub_wechat_mp_account_articles",
  display_name: {
    en_US: "WeChat Official Account · Get Articles",
    zh_Hans: "微信公众号 · 获取历史文章",
  },
  description: {
    en_US:
      "Fetch historical official account articles, videos, audio, or image-text posts with offset pagination.",
    zh_Hans: "获取公众号历史文章、视频、音频或贴图内容，支持 offset 游标翻页。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "username",
      required: true,
      maxLength: 64,
      pattern: "^gh_[A-Za-z0-9_]+$",
      displayName: { en_US: "Username", zh_Hans: "Username" },
      hint: {
        en_US:
          "Official account username, for example gh_363b924965e9. Do not use a Channels username.",
        zh_Hans:
          "公众号 username，例如 gh_363b924965e9。不要填写视频号 username。",
      },
      llmDescription: {
        en_US:
          "WeChat official account username used to fetch historical articles. The gh_ prefix is part of the official account username; do not pass a WeChat Channels v2_...@finder username here.",
        zh_Hans:
          "用于获取公众号历史文章的 username。gh_ 是公众号 username 的组成部分；不要在这里传入视频号 v2_...@finder username。",
      },
    }),
    wechatIntegerParameter({
      name: "page_size",
      default: 20,
      min: 10,
      max: 20,
      displayName: { en_US: "Page Size", zh_Hans: "每页数量" },
      hint: {
        en_US: "OpenAPI default 20. Allowed range is 10-20.",
        zh_Hans: "OpenAPI 默认 20。允许范围 10-20。",
      },
      llmDescription: {
        en_US:
          "Number of account articles per page. Default 20, minimum 10, maximum 20.",
        zh_Hans: "每页公众号内容数量。默认 20，最小 10，最大 20。",
      },
    }),
    wechatStringParameter({
      name: "offset",
      default: "",
      maxLength: 8192,
      pattern: "^[A-Za-z0-9+/=_-]*$",
      displayName: { en_US: "Offset Cursor", zh_Hans: "分页 offset" },
      hint: {
        en_US:
          "Leave empty for the first page. For pagination, pass next_offset from the previous response unchanged.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应的 next_offset。",
      },
      llmDescription: {
        en_US:
          "Opaque account article pagination cursor. Use the previous response next_offset exactly as returned.",
        zh_Hans:
          "公众号文章不透明分页游标。使用上次响应返回的 next_offset，必须原样传入。",
      },
    }),
    wechatSelectParameter({
      name: "item_show_type",
      values: articleItemShowTypeValues,
      default: "0",
      displayName: { en_US: "Content Type", zh_Hans: "内容类型" },
      hint: {
        en_US: "0 articles, 5 videos, 7 audio, 8 image-text posts.",
        zh_Hans: "0 文章，5 视频，7 音频，8 贴图。",
      },
      llmDescription: {
        en_US:
          "Official account content tab. Valid string values: 0 articles, 5 videos, 7 audio, 8 image-text posts. Send as the selected value.",
        zh_Hans:
          "公众号内容栏目。有效字符串值：0 文章、5 视频、7 音频、8 贴图。按选中值发送。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      username: readOfficialAccountUsername(p),
      page_size: readOptionalIntegerParam(p, "page_size") ?? 20,
      offset:
        readOptionalConstrainedStringParam(p, "offset", {
          label: "offset",
          maxLength: 8192,
          pattern: /^[A-Za-z0-9+/=_-]*$/,
        }) ?? "",
      item_show_type: readOptionalStringParam(p, "item_show_type") ?? "0",
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
