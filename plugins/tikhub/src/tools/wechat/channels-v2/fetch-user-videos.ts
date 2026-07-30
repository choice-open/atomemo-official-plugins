import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readFinderUsername,
  readOptionalBooleanParam,
  readOptionalStringParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_channels_fetch_user_videos",
  method: "POST",
  path: "/api/v1/wechat_channels/v2/fetch_user_videos",
}

export const tikhub_wechat_channels_user_videos: ToolDefinition = {
  name: "tikhub_wechat_channels_user_videos",
  display_name: {
    en_US: "WeChat Channels · Get User Videos",
    zh_Hans: "微信视频号 · 获取历史作品",
  },
  description: {
    en_US:
      "Fetch historical videos for a WeChat Channels finder account with last_buffer pagination.",
    zh_Hans: "获取指定视频号账号历史作品列表，支持 last_buffer 翻页。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Username", zh_Hans: "Username" },
      hint: {
        en_US:
          "WeChat Channels username from the resolver or video detail. The plugin accepts the upstream finder value directly.",
        zh_Hans:
          "视频号 username，来自解析工具或作品详情。插件可直接接收上游 finder 值。",
      },
      llmDescription: {
        en_US:
          "WeChat Channels username for the account whose historical videos should be fetched. If a v2_... value is missing @finder, the plugin appends it.",
        zh_Hans:
          "需要获取历史作品的视频号 username。如果 v2_... 值缺少 @finder，插件会自动补齐。",
      },
    }),
    wechatStringParameter({
      name: "last_buffer",
      default: "",
      displayName: { en_US: "Last Buffer", zh_Hans: "分页 last_buffer" },
      hint: {
        en_US:
          "Leave empty for the first page. Pass the returned last_buffer unchanged for pagination.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 last_buffer。",
      },
      llmDescription: {
        en_US:
          "Opaque user-video pagination cursor. Pass it back exactly as returned; do not download or decrypt media from the response.",
        zh_Hans:
          "视频号作品不透明分页游标。必须原样传回；不要下载或解密响应中的媒体文件。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      username: readFinderUsername(p),
      last_buffer: readOptionalStringParam(p, "last_buffer") ?? "",
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
