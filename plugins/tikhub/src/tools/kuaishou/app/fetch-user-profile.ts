import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_one_user_v2",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_one_user_v2",
}

export const tikhub_kuaishou_user_profile: ToolDefinition = {
  name: "tikhub_kuaishou_user_profile",
  display_name: {
    en_US: "Kuaishou · User Profile",
    zh_Hans: "快手 · 用户资料",
  },
  description: {
    en_US:
      "Fetch a Kuaishou user profile by eID or numeric userId with the more stable V2 endpoint. This endpoint is higher-priced; check the latest price in the TikHub dashboard.",
    zh_Hans:
      "使用稳定性更好的 V2 接口，通过 eID 或数字 userId 获取快手用户资料。该接口价格较高，请查看 TikHub 后台最新价格。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "user_id",
      required: true,
      displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
      hint: {
        en_US:
          "Required eID or numeric userId. This stable V2 endpoint is higher-priced; check the TikHub dashboard.",
        zh_Hans:
          "必填 eID 或数字 userId。稳定版 V2 接口价格较高，请查看 TikHub 后台最新价格。",
      },
      llmDescription: {
        en_US:
          "Required eID or numeric userId. Keep it as a string; use the returned numeric userId for the user videos tool.",
        zh_Hans:
          "必填 eID 或数字 userId。按字符串保留；用户投稿工具需使用资料响应中的纯数字 userId。",
      },
      placeholder: { en_US: "3xz63mn6fngqtiq", zh_Hans: "3xz63mn6fngqtiq" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      user_id: readRequiredString(p, "user_id"),
    })
  },
}
