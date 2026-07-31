import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readAtLeastOneStringParam,
  readOptionalBooleanParam,
  readOptionalConstrainedStringParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_channels_fetch_video_detail",
  method: "POST",
  path: "/api/v1/wechat_channels/v2/fetch_video_detail",
}

export const tikhub_wechat_channels_video_detail: ToolDefinition = {
  name: "tikhub_wechat_channels_video_detail",
  display_name: {
    en_US: "WeChat Channels · Get Video Detail",
    zh_Hans: "微信视频号 · 获取作品详情",
  },
  description: {
    en_US:
      "Get WeChat Channels video detail by object_id, export_id from search, or share_url.",
    zh_Hans:
      "通过 object_id、搜索结果 export_id 或分享链接获取视频号作品详情。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "object_id",
      default: "",
      maxLength: 32,
      pattern: "^[0-9]*$",
      displayName: { en_US: "Object ID", zh_Hans: "作品 object_id" },
      hint: {
        en_US: "Preferred numeric objectId. Pass it as a string.",
        zh_Hans: "优先使用的数字 objectId，必须按字符串传递。",
      },
      llmDescription: {
        en_US:
          "WeChat Channels object_id. Highest priority when provided. Treat as a string and never convert to Number.",
        zh_Hans:
          "视频号 object_id。提供时优先级最高。必须按字符串处理，禁止转为 Number。",
      },
    }),
    wechatStringParameter({
      name: "export_id",
      default: "",
      maxLength: 2048,
      pattern: "^(export/.+)?$",
      displayName: { en_US: "Export ID", zh_Hans: "搜索 export_id" },
      hint: {
        en_US:
          "exportId from WeChat video search results. It may expire, so call detail soon.",
        zh_Hans: "视频搜索结果中的 exportId，可能过期，请尽快调用详情。",
      },
      llmDescription: {
        en_US:
          "exportId from WeChat Search video results, often starting with export/. It may expire; pass as a string.",
        zh_Hans:
          "视频搜索结果中的 exportId，通常以 export/ 开头，可能过期；按字符串传递。",
      },
    }),
    wechatStringParameter({
      name: "object_nonce_id",
      default: "",
      maxLength: 32,
      pattern: "^[0-9]*$",
      displayName: { en_US: "Object Nonce ID", zh_Hans: "object_nonce_id" },
      hint: {
        en_US:
          "Optional objectNonceId, passed as a string to improve matching.",
        zh_Hans: "可选 objectNonceId，按字符串传递以提升命中率。",
      },
      llmDescription: {
        en_US:
          "Optional object_nonce_id helper value. Treat as an opaque string and do not convert to Number.",
        zh_Hans:
          "可选辅助命中参数 object_nonce_id。按不透明字符串处理，不要转为 Number。",
      },
    }),
    wechatStringParameter({
      name: "share_url",
      default: "",
      maxLength: 256,
      pattern: "^(https?://weixin\\.qq\\.com/sph/[A-Za-z0-9]+/?)?$",
      displayName: { en_US: "Share URL", zh_Hans: "分享链接" },
      hint: {
        en_US:
          "WeChat Channels share URL, used only when object_id and export_id are empty.",
        zh_Hans: "视频号分享链接，仅在 object_id 和 export_id 为空时使用。",
      },
      llmDescription: {
        en_US:
          "WeChat Channels share URL such as https://weixin.qq.com/sph/..., used after object_id and export_id priority.",
        zh_Hans:
          "视频号分享链接，例如 https://weixin.qq.com/sph/...，优先级低于 object_id 和 export_id。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    readAtLeastOneStringParam(p, ["object_id", "export_id", "share_url"])
    return invokeWeChatPost(endpoint, args, {
      object_id:
        readOptionalConstrainedStringParam(p, "object_id", {
          label: "object_id",
          maxLength: 32,
          pattern: /^[0-9]*$/,
          example: "14941130915890399732",
        }) ?? "",
      export_id:
        readOptionalConstrainedStringParam(p, "export_id", {
          label: "export_id",
          maxLength: 2048,
          pattern: /^(export\/.+)?$/,
          example: "export/...",
        }) ?? "",
      object_nonce_id:
        readOptionalConstrainedStringParam(p, "object_nonce_id", {
          label: "object_nonce_id",
          maxLength: 32,
          pattern: /^[0-9]*$/,
        }) ?? "",
      share_url:
        readOptionalConstrainedStringParam(p, "share_url", {
          label: "share_url",
          maxLength: 256,
          pattern: /^(https?:\/\/weixin\.qq\.com\/sph\/[A-Za-z0-9]+\/?)?$/,
          example: "https://weixin.qq.com/sph/...",
        }) ?? "",
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
