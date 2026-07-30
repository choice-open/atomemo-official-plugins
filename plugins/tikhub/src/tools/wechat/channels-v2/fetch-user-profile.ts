import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readFinderUsername,
  readOptionalBooleanParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_channels_fetch_user_profile",
  method: "POST",
  path: "/api/v1/wechat_channels/v2/fetch_user_profile",
}

export const tikhub_wechat_channels_user_profile: ToolDefinition = {
  name: "tikhub_wechat_channels_user_profile",
  display_name: {
    en_US: "WeChat Channels · Get User Profile",
    zh_Hans: "微信视频号 · 获取主页资料",
  },
  description: {
    en_US:
      "Get WeChat Channels profile details and account statistics by username.",
    zh_Hans: "根据 username 获取视频号主页资料和账号统计。",
  },
  icon: "👤",
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
          "WeChat Channels username. Prefer the value returned by Resolve Finder Username or video detail. If a v2_... value is missing @finder, the plugin appends it.",
        zh_Hans:
          "视频号 username。优先使用解析工具或作品详情返回的值。如果 v2_... 值缺少 @finder，插件会自动补齐。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      username: readFinderUsername(p),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
