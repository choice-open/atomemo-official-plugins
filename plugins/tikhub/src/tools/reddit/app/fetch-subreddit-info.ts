import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readSubredditName,
  redditStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_subreddit_info",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_subreddit_info",
}

export const tikhub_reddit_subreddit_info: ToolDefinition = {
  name: "tikhub_reddit_subreddit_info",
  display_name: {
    en_US: "Reddit · Get Subreddit Info",
    zh_Hans: "Reddit · 获取社区资料",
  },
  description: {
    en_US:
      "Fetch subreddit profile, description, member count, and creation metadata.",
    zh_Hans: "获取 Subreddit 社区资料、描述、成员数和创建信息。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "subreddit_name",
      default: "pics",
      displayName: { en_US: "Subreddit Name", zh_Hans: "Subreddit 名称" },
      hint: {
        en_US: "OpenAPI default pics. Enter the subreddit name without r/.",
        zh_Hans: "OpenAPI 默认 pics。填写不带 r/ 前缀的 subreddit 名称。",
      },
      llmDescription: {
        en_US:
          "Subreddit name without the r/ prefix. Live OpenAPI schema.default is pics.",
        zh_Hans:
          "Subreddit 名称，不带 r/ 前缀。实时 OpenAPI schema.default 为 pics。",
      },
      placeholder: { en_US: "SaaS", zh_Hans: "SaaS" },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      subreddit_name: readSubredditName(p, {
        required: false,
        defaultValue: "pics",
      }),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
