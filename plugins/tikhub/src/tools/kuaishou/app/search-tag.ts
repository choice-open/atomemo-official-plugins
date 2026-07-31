import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  pcursorParameter,
  readOpaqueCursor,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_search_tag",
  method: "GET",
  path: "/api/v1/kuaishou/app/search_tag",
}

export const tikhub_kuaishou_tag_search: ToolDefinition = {
  name: "tikhub_kuaishou_tag_search",
  display_name: {
    en_US: "Kuaishou · Tag Search",
    zh_Hans: "快手 · 话题标签搜索",
  },
  description: {
    en_US: "Search Kuaishou topic tags by keyword.",
    zh_Hans: "按关键词搜索快手话题标签。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Tag Keyword", zh_Hans: "话题关键词" },
      hint: {
        en_US: "Required topic tag keyword.",
        zh_Hans: "必填话题标签关键词。",
      },
      llmDescription: {
        en_US: "Required Kuaishou tag keyword.",
        zh_Hans: "快手话题标签搜索的必填关键词。",
      },
      placeholder: { en_US: "Challenge", zh_Hans: "挑战" },
    }),
    pcursorParameter(),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      keyword: readRequiredString(p, "keyword"),
      pcursor: readOpaqueCursor(p),
    })
  },
}
