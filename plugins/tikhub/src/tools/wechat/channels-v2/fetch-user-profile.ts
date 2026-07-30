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
      "Get WeChat Channels finder profile details and account statistics by username.",
    zh_Hans: "根据 finder username 获取视频号主页资料和账号统计。",
  },
  icon: "👤",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Finder Username", zh_Hans: "视频号 username" },
      hint: {
        en_US: "Required finder username, usually v2_...@finder.",
        zh_Hans: "必填 finder username，通常为 v2_...@finder。",
      },
      llmDescription: {
        en_US:
          "WeChat Channels finder username in v2_...@finder format, often obtained from video detail.",
        zh_Hans:
          "视频号 finder username，格式通常为 v2_...@finder，可从作品详情获得。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      username: readOptionalStringParam(p, "username"),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
