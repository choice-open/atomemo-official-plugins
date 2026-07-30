import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOfficialAccountUsername,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_mp_fetch_account_profile",
  method: "POST",
  path: "/api/v1/wechat_mp/v2/fetch_account_profile",
}

export const tikhub_wechat_mp_account_profile: ToolDefinition = {
  name: "tikhub_wechat_mp_account_profile",
  display_name: {
    en_US: "WeChat Official Account · Get Profile",
    zh_Hans: "微信公众号 · 获取账号资料",
  },
  description: {
    en_US:
      "Get official account profile details by username. The plugin adds the upstream prefix when needed.",
    zh_Hans: "根据 username 获取公众号资料；插件会在需要时自动补齐上游前缀。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Username", zh_Hans: "Username" },
      hint: {
        en_US:
          "Official account username. Do not use a Channels username; the plugin adds the upstream prefix if needed.",
        zh_Hans:
          "公众号 username。不要填写视频号 username；插件会在需要时自动补齐上游前缀。",
      },
      llmDescription: {
        en_US:
          "WeChat official account username. Do not ask the user to add the gh_ prefix, and do not pass a WeChat Channels v2_...@finder username here.",
        zh_Hans:
          "微信公众号 username。不要要求用户手动添加 gh_ 前缀，也不要在这里传入视频号 v2_...@finder username。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      username: readOfficialAccountUsername(p),
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
