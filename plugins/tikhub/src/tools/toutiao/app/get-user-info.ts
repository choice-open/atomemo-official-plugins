import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeToutiaoGet,
  readTrimmedRequired,
  toutiaoStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "toutiao_app_get_user_info",
  method: "GET",
  path: "/api/v1/toutiao/app/get_user_info",
}

export const tikhub_toutiao_user_info: ToolDefinition = {
  name: "tikhub_toutiao_user_info",
  display_name: {
    en_US: "Toutiao · User Info",
    zh_Hans: "今日头条 · 用户资料",
  },
  description: {
    en_US: "Fetch Toutiao user profile information by user ID.",
    zh_Hans: "通过 user_id 获取今日头条用户资料。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    toutiaoStringParameter({
      name: "user_id",
      required: true,
      displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
      hint: {
        en_US:
          "Required Toutiao user_id, usually returned by the profile URL resolver. Keep it as a string.",
        zh_Hans:
          "必填今日头条 user_id，通常来自主页转用户 ID 工具。按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Toutiao user_id. Treat it as a string and never convert long numeric IDs to JavaScript numbers.",
        zh_Hans:
          "必填今日头条 user_id。按字符串处理，不要把长数字 ID 转成 JavaScript number。",
      },
      placeholder: {
        en_US: "1234567890123456789",
        zh_Hans: "1234567890123456789",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeToutiaoGet(endpoint, args, {
      user_id: readTrimmedRequired(p, "user_id", "user_id"),
    })
  },
}
