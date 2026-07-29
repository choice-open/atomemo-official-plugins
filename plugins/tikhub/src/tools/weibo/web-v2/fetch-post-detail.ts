import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  longTextValues,
  postIdParameter,
  readOptionalStringParam,
  weiboSelectParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_post_detail",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_post_detail",
}

export const tikhub_weibo_post_detail: ToolDefinition = {
  name: "tikhub_weibo_post_detail",
  display_name: {
    en_US: "Weibo · Get Post Detail",
    zh_Hans: "微博 · 获取微博正文",
  },
  description: {
    en_US:
      "Get complete Weibo post content, author information, and engagement metrics by post ID.",
    zh_Hans: "根据微博 ID 获取完整正文、作者信息和互动指标。",
  },
  icon: "📝",
  parameters: [
    credentialParameter,
    postIdParameter,
    weiboSelectParameter({
      name: "is_get_long_text",
      values: longTextValues,
      default: "true",
      displayName: { en_US: "Get Long Text", zh_Hans: "获取长微博全文" },
      hint: {
        en_US:
          "Defaults to true. Keep as a string because TikHub OpenAPI requires true/false strings.",
        zh_Hans:
          "默认 true。根据 TikHub OpenAPI 要求以 true/false 字符串传递。",
      },
      llmDescription: {
        en_US:
          "Whether to get full long Weibo text. Must be one of string values: true, false. Default is true.",
        zh_Hans: "是否获取长微博全文。必须是字符串值：true、false。默认 true。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      id: readOptionalStringParam(p, "id"),
      is_get_long_text:
        readOptionalStringParam(p, "is_get_long_text") ?? "true",
    })
  },
}
