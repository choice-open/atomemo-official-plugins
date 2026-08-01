import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouIntegerParameter,
  readInteger,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_hot_board_detail",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_hot_board_detail",
}

export const tikhub_kuaishou_hot_board_details: ToolDefinition = {
  name: "tikhub_kuaishou_hot_board_details",
  display_name: {
    en_US: "Kuaishou · Hot Board Details",
    zh_Hans: "快手 · 热榜详情",
  },
  description: {
    en_US:
      "Fetch a Kuaishou hot board using integer boardType and boardId values returned by hot board categories.",
    zh_Hans: "使用热榜分类返回的整数 boardType 和 boardId 获取快手热榜详情。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouIntegerParameter({
      name: "boardType",
      default: 1,
      displayName: { en_US: "Board Type", zh_Hans: "榜单类型" },
      hint: {
        en_US: "Integer from hot board categories. OpenAPI default 1.",
        zh_Hans: "来自热榜分类响应的整数。OpenAPI 默认 1。",
      },
      llmDescription: {
        en_US: "Integer boardType returned by hot board categories.",
        zh_Hans: "热榜分类返回的整数 boardType。",
      },
    }),
    kuaishouIntegerParameter({
      name: "boardId",
      default: 1,
      displayName: { en_US: "Board ID", zh_Hans: "榜单 ID" },
      hint: {
        en_US:
          "Integer from hot board categories. The live OpenAPI declares integer but has an invalid string default; this tool uses numeric 1.",
        zh_Hans:
          "来自热榜分类响应的整数。实时 OpenAPI 声明 integer 却给出错误字符串默认值；本工具使用数字 1。",
      },
      llmDescription: {
        en_US:
          "Integer boardId returned by hot board categories. Never silently coerce string input.",
        zh_Hans: "热榜分类返回的整数 boardId。不要静默转换字符串输入。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      boardType: String(readInteger(p, "boardType", 1)),
      boardId: String(readInteger(p, "boardId", 1)),
    })
  },
}
