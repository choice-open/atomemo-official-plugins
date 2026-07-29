import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeTwitterGet,
  readOptionalStringParam,
  TRENDING_COUNTRIES,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_trending",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_trending",
}

export const tikhub_twitter_trending: ToolDefinition = {
  name: "tikhub_twitter_trending",
  display_name: {
    en_US: "Twitter · Trending",
    zh_Hans: "Twitter · 趋势",
  },
  description: {
    en_US: "Get X/Twitter trending topics by country.",
    zh_Hans: "按国家获取 X/Twitter 趋势话题。",
  },
  icon: "🐦",
  parameters: [
    credentialParameter,
    {
      name: "country",
      type: "string",
      required: false,
      default: "UnitedStates",
      enum: [...TRENDING_COUNTRIES],
      display_name: { en_US: "Country", zh_Hans: "国家" },
      ai: {
        llm_description: {
          en_US: `Country for trending topics. Default is UnitedStates. Must be one of: ${TRENDING_COUNTRIES.join(", ")}.`,
          zh_Hans: `趋势国家，默认 UnitedStates。可选值：${TRENDING_COUNTRIES.join("、")}。`,
        },
      },
      ui: {
        component: "select",
        hint: {
          en_US:
            "Select the country whose X/Twitter trends should be returned.",
          zh_Hans: "选择要获取 X/Twitter 趋势的国家。",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"country">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      country: readOptionalStringParam(p, "country") ?? "UnitedStates",
    })
  },
}
