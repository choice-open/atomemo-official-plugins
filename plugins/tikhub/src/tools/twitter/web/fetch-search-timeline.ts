import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  cursorParameter,
  invokeTwitterGet,
  readOptionalStringParam,
  SEARCH_TYPES,
  twitterStringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_search_timeline",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_search_timeline",
}

export const tikhub_twitter_search_timeline: ToolDefinition = {
  name: "tikhub_twitter_search_timeline",
  display_name: {
    en_US: "Twitter · Search Timeline",
    zh_Hans: "Twitter · 搜索时间线",
  },
  description: {
    en_US: "Search X/Twitter content by keyword for monitoring and discovery.",
    zh_Hans: "按关键词搜索 X/Twitter 内容，用于舆情监测和热点发现。",
  },
  icon: "🐦",
  parameters: [
    credentialParameter,
    twitterStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Search keyword or phrase, for example Elon Musk.",
        zh_Hans: "搜索关键词或短语，例如 Elon Musk。",
      },
      llmDescription: {
        en_US:
          "Keyword or phrase used to search X/Twitter content for social listening, topics, accounts, media, or lists.",
        zh_Hans:
          "用于搜索 X/Twitter 内容的关键词或短语，可用于舆情、话题、账号、媒体或列表发现。",
      },
      placeholder: { en_US: "Elon Musk", zh_Hans: "Elon Musk" },
    }),
    {
      name: "search_type",
      type: "string",
      required: false,
      default: "Top",
      enum: [...SEARCH_TYPES],
      display_name: { en_US: "Search Type", zh_Hans: "搜索类型" },
      ai: {
        llm_description: {
          en_US:
            "Search category. Must be one of: Top (default), Latest, Media, People, Lists.",
          zh_Hans:
            "搜索类型。可选值：Top（默认）、Latest、Media、People、Lists。",
        },
      },
      ui: {
        component: "select",
        hint: {
          en_US:
            "Top is the default. Use Latest for real-time monitoring, Media for media posts, People for accounts, Lists for lists.",
          zh_Hans:
            "默认 Top。实时监测用 Latest，媒体内容用 Media，找账号用 People，找列表用 Lists。",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"search_type">,
    cursorParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      keyword: readOptionalStringParam(p, "keyword"),
      search_type: readOptionalStringParam(p, "search_type") ?? "Top",
      cursor: readOptionalStringParam(p, "cursor"),
    })
  },
}
