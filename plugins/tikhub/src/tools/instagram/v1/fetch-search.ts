import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramSelectParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readSearchSelect,
  readTrimmedRequired,
  searchSelectValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_search",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_search",
}

export const tikhub_instagram_search: ToolDefinition = {
  name: "tikhub_instagram_search",
  display_name: {
    en_US: "Instagram · Search",
    zh_Hans: "Instagram · 搜索",
  },
  description: {
    en_US: "Search Instagram users, hashtags, and places by keyword.",
    zh_Hans: "按关键词搜索 Instagram 用户、话题标签和地点。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "query",
      required: true,
      displayName: { en_US: "Query", zh_Hans: "关键词" },
      hint: {
        en_US: "Required Instagram search keyword.",
        zh_Hans: "必填 Instagram 搜索关键词。",
      },
      llmDescription: {
        en_US:
          "Required keyword for Instagram social listening, hashtag discovery, places, competitors, or potential customers.",
        zh_Hans:
          "Instagram 搜索必填关键词，可用于舆情、话题、地点、竞对或潜在客户发现。",
      },
      placeholder: { en_US: "taylorswift", zh_Hans: "taylorswift" },
    }),
    instagramSelectParameter({
      name: "select",
      values: searchSelectValues,
      displayName: { en_US: "Filter Type", zh_Hans: "筛选类型" },
      hint: {
        en_US:
          "Optional. Choose users, hashtags, or places. Leave empty to return all result types.",
        zh_Hans: "可选。选择 users、hashtags 或 places；留空返回全部类型。",
      },
      llmDescription: {
        en_US:
          "Optional result filter. Valid values: users, hashtags, places. Omit it to return all types.",
        zh_Hans:
          "可选结果筛选。有效值：users、hashtags、places。不传则返回全部类型。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      query: readTrimmedRequired(p, "query", "query"),
      select: readSearchSelect(p),
    })
  },
}
