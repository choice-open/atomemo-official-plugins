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
      "Get official account profile details by official account username.",
    zh_Hans: "根据公众号 username 获取公众号资料。",
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
          "Official account username, for example gh_363b924965e9. Do not use a Channels username.",
        zh_Hans:
          "公众号 username，例如 gh_363b924965e9。不要填写视频号 username。",
      },
      llmDescription: {
        en_US:
          "WeChat official account username. The gh_ prefix is part of the official account username; do not pass a WeChat Channels v2_...@finder username here.",
        zh_Hans:
          "微信公众号 username。gh_ 是公众号 username 的组成部分；不要在这里传入视频号 v2_...@finder username。",
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
