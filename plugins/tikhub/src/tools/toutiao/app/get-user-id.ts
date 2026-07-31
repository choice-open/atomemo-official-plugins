import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeToutiaoGet,
  readTrimmedRequired,
  toutiaoStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "toutiao_app_get_user_id",
  method: "GET",
  path: "/api/v1/toutiao/app/get_user_id",
}

export const tikhub_toutiao_user_id_from_profile: ToolDefinition = {
  name: "tikhub_toutiao_user_id_from_profile",
  display_name: {
    en_US: "Toutiao · User ID from Profile",
    zh_Hans: "今日头条 · 主页转用户 ID",
  },
  description: {
    en_US: "Resolve a Toutiao user profile URL to a user ID.",
    zh_Hans: "将今日头条用户主页 URL 转换为 user_id。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    toutiaoStringParameter({
      name: "user_profile_url",
      required: true,
      displayName: { en_US: "User Profile URL", zh_Hans: "用户主页 URL" },
      hint: {
        en_US:
          "Required full Toutiao user profile URL. Do not pass only a token fragment.",
        zh_Hans: "必填完整今日头条用户主页 URL，不要只传 token 片段。",
      },
      llmDescription: {
        en_US:
          "Required full Toutiao user profile URL. This tool extracts the user_id through TikHub; do not pass a username or partial token.",
        zh_Hans:
          "必填完整今日头条用户主页 URL。该工具通过 TikHub 获取 user_id；不要传用户名或局部 token。",
      },
      placeholder: {
        en_US: "https://www.toutiao.com/c/user/token/...",
        zh_Hans: "https://www.toutiao.com/c/user/token/...",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeToutiaoGet(endpoint, args, {
      user_profile_url: readTrimmedRequired(
        p,
        "user_profile_url",
        "user_profile_url",
      ),
    })
  },
}
