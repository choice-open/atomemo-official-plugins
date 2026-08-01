import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouSelectParameter,
  kuaishouStringParameter,
  pcursorParameter,
  readEnum,
  readNumericUserId,
  readOpaqueCursor,
  userPostSortValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_user_post_v2",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_user_post_v2",
}

export const tikhub_kuaishou_user_videos: ToolDefinition = {
  name: "tikhub_kuaishou_user_videos",
  display_name: { en_US: "Kuaishou · User Videos", zh_Hans: "快手 · 用户投稿" },
  description: {
    en_US:
      "Fetch latest or hot Kuaishou user posts with the more stable V2 endpoint. It requires a numeric userId, not an eID. This endpoint is higher-priced; check the latest price in the TikHub dashboard.",
    zh_Hans:
      "使用稳定性更好的 V2 接口获取快手用户最新或热门投稿。只接受纯数字 userId，不接受 eID。该接口价格较高，请查看 TikHub 后台最新价格。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "user_id",
      required: true,
      displayName: { en_US: "Numeric User ID", zh_Hans: "纯数字用户 ID" },
      hint: {
        en_US:
          "Required numeric userId from the user profile response; eIDs are rejected. This stable V2 endpoint is higher-priced.",
        zh_Hans:
          "必填用户资料响应中的纯数字 userId；拒绝 eID。稳定版 V2 接口价格较高。",
      },
      llmDescription: {
        en_US:
          "Required digits-only userId. Resolve eIDs with the user profile tool first and keep the numeric ID as a string.",
        zh_Hans:
          "必填纯数字 userId。先用用户资料工具解析 eID，并将数字 ID 作为字符串保留。",
      },
      placeholder: { en_US: "903511772", zh_Hans: "903511772" },
    }),
    pcursorParameter(),
    kuaishouSelectParameter({
      name: "sort",
      values: userPostSortValues,
      default: "latest",
      displayName: { en_US: "Sort", zh_Hans: "排序方式" },
      hint: {
        en_US: "OpenAPI default latest.",
        zh_Hans: "OpenAPI 默认 latest。",
      },
      llmDescription: {
        en_US: "Allowed values: latest, hot.",
        zh_Hans: "只允许 latest、hot。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      user_id: readNumericUserId(p),
      pcursor: readOpaqueCursor(p),
      sort: readEnum(p, "sort", userPostSortValues, "latest"),
    })
  },
}
