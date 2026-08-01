import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { credentialParameter, invokeKuaishouGet } from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_hot_board_categories",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_hot_board_categories",
}

export const tikhub_kuaishou_hot_board_categories: ToolDefinition = {
  name: "tikhub_kuaishou_hot_board_categories",
  display_name: {
    en_US: "Kuaishou · Hot Board Categories",
    zh_Hans: "快手 · 热榜分类",
  },
  description: {
    en_US:
      "Fetch Kuaishou hot board categories and the boardType/boardId values needed for board details.",
    zh_Hans: "获取快手热榜分类，以及热榜详情所需的 boardType/boardId。",
  },
  icon: "🎬",
  parameters: [credentialParameter],
  invoke: async ({ args }) => invokeKuaishouGet(endpoint, args, {}),
}
