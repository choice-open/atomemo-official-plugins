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
      "Get official account profile details by gh_username from WeChat Search account results.",
    zh_Hans: "根据微信搜一搜账号结果中的 gh_username 获取公众号资料。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "GH Username", zh_Hans: "公众号 gh_username" },
      hint: {
        en_US: "Required gh_username, usually gh_..., from jumpInfo.userName.",
        zh_Hans: "必填 gh_username，通常为 gh_...，可来自 jumpInfo.userName。",
      },
      llmDescription: {
        en_US:
          "WeChat official account gh_username, usually obtained from WeChat Search account result jumpInfo.userName.",
        zh_Hans:
          "微信公众号 gh_username，通常从微信搜一搜 account 结果的 jumpInfo.userName 获得。",
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
