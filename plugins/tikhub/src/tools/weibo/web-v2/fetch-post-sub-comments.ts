import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  invokeWeiboGet,
  maxIdParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_post_sub_comments",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_post_sub_comments",
}

export const tikhub_weibo_post_sub_comments: ToolDefinition = {
  name: "tikhub_weibo_post_sub_comments",
  display_name: {
    en_US: "Weibo · Get Post Sub-comments",
    zh_Hans: "微博 · 获取子评论",
  },
  description: {
    en_US:
      "Fetch replies under a first-level Weibo comment using the main comment ID.",
    zh_Hans: "根据一级评论 ID 获取评论回复，支持 count 和 max_id 翻页。",
  },
  icon: "💬",
  parameters: [
    credentialParameter,
    weiboStringParameter({
      name: "id",
      required: true,
      displayName: { en_US: "Main Comment ID", zh_Hans: "主评论 ID" },
      hint: {
        en_US: "First-level Weibo comment ID, not the post ID.",
        zh_Hans: "一级微博评论 ID，不是微博 ID。",
      },
      llmDescription: {
        en_US:
          "Main first-level comment ID used to fetch replies. Provide it as a string and do not convert it to a number.",
        zh_Hans: "用于获取回复的一级评论 ID。请以字符串提供，不要转换为数字。",
      },
    }),
    countParameter("sub-comments"),
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
