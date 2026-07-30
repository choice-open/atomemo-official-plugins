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
          "WeChat Channels username from the resolver or video detail, for example v2_...@finder.",
        zh_Hans:
          "视频号 username，来自解析工具或作品详情，例如 v2_...@finder。",
      },
      llmDescription: {
        en_US:
          "WeChat Channels username. The v2_...@finder format is the full username returned by Resolve Finder Username or video detail.",
        zh_Hans:
          "视频号 username。v2_...@finder 是解析工具或作品详情返回的完整 username。",
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
