import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  invokeWeiboGet,
  maxIdParameter,
  postIdParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_post_comments",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_post_comments",
}

export const tikhub_weibo_post_comments: ToolDefinition = {
  name: "tikhub_weibo_post_comments",
  display_name: {
    en_US: "Weibo · Get Post Comments",
    zh_Hans: "微博 · 获取一级评论",
  },
  description: {
    en_US:
      "Fetch first-level comments for a Weibo post with count and max_id pagination.",
    zh_Hans: "根据微博 ID 获取一级评论，支持 count 和 max_id 翻页。",
  },
  icon: "💬",
  parameters: [
    credentialParameter,
    postIdParameter,
    countParameter("comments"),
    maxIdParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      id: readOptionalStringParam(p, "id"),
      count: readOptionalIntegerParam(p, "count") ?? "10",
      max_id: readOptionalStringParam(p, "max_id") ?? "",
    })
  },
}
