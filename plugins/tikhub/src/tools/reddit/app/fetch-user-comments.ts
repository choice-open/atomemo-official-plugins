import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalIntegerParam,
  readOptionalStringParam,
  readUsername,
  redditIntegerParameter,
  redditSelectParameter,
  redditStringParameter,
  userContentSortValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_user_comments",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_user_comments",
}

export const tikhub_reddit_user_comments: ToolDefinition = {
  name: "tikhub_reddit_user_comments",
  display_name: {
    en_US: "Reddit · Get User Comments",
    zh_Hans: "Reddit · 获取用户评论",
  },
  description: {
    en_US:
      "Fetch comments written by a Reddit user for opinion, need, complaint, and intent analysis.",
    zh_Hans: "获取指定 Reddit 用户发表的评论，用于观点、需求、抱怨和意向分析。",
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
        en_US:
          "User comments sort. Valid values: NEW, TOP, HOT, CONTROVERSIAL.",
        zh_Hans: "用户评论排序。有效值：NEW、TOP、HOT、CONTROVERSIAL。",
      },
    }),
    redditIntegerParameter({
      name: "page_size",
      default: 25,
      displayName: { en_US: "Page Size", zh_Hans: "每页数量" },
      hint: {
        en_US:
          "OpenAPI default 25. Live OpenAPI does not declare a min or max.",
        zh_Hans: "OpenAPI 默认 25。实时 OpenAPI 未声明最小值或最大值。",
      },
      llmDescription: {
        en_US:
          "Page size for user comments. OpenAPI schema.default is 25 and no numeric range is declared.",
        zh_Hans:
          "用户评论每页数量。OpenAPI schema.default 为 25，未声明数值范围。",
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
      page_size: String(readOptionalIntegerParam(p, "page_size") ?? 25),
      after: readOptionalStringParam(p, "after"),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
