import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  readUsername,
  redditSelectParameter,
  redditStringParameter,
  userContentSortValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_user_posts",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_user_posts",
}

export const tikhub_reddit_user_posts: ToolDefinition = {
  name: "tikhub_reddit_user_posts",
  display_name: {
    en_US: "Reddit · Get User Posts",
    zh_Hans: "Reddit · 获取用户帖子",
  },
  description: {
    en_US:
      "Fetch posts submitted by a Reddit user for historical behavior analysis.",
    zh_Hans: "获取指定 Reddit 用户发布的帖子，用于历史观点和活跃社区分析。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Username", zh_Hans: "用户名" },
      hint: {
        en_US: "Required Reddit username without u/.",
        zh_Hans: "必填 Reddit 用户名，不带 u/ 前缀。",
      },
      llmDescription: {
        en_US: "Reddit username without the u/ prefix.",
        zh_Hans: "Reddit 用户名，不带 u/ 前缀。",
      },
    }),
    redditSelectParameter({
      name: "sort",
      values: userContentSortValues,
      default: "NEW",
      displayName: { en_US: "Sort", zh_Hans: "排序" },
      hint: {
        en_US: "OpenAPI default NEW.",
        zh_Hans: "OpenAPI 默认 NEW。",
      },
      llmDescription: {
        en_US: "User posts sort. Valid values: NEW, TOP, HOT, CONTROVERSIAL.",
        zh_Hans: "用户帖子排序。有效值：NEW、TOP、HOT、CONTROVERSIAL。",
      },
    }),
    redditStringParameter({
      name: "after",
      default: "",
      displayName: { en_US: "After", zh_Hans: "分页 after" },
      hint: {
        en_US:
          "OpenAPI default empty. For pagination, pass the returned after cursor unchanged.",
        zh_Hans: "OpenAPI 默认空字符串。翻页时原样传回响应中的 after cursor。",
      },
      llmDescription: {
        en_US: "Opaque pagination cursor. Do not parse, decode, or rewrite it.",
        zh_Hans: "不透明分页 cursor。不要解析、解码或改写。",
      },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      username: readUsername(p),
      sort: readOptionalStringParam(p, "sort") ?? "NEW",
      after: readOptionalStringParam(p, "after"),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
