import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  groupIdParameter,
  invokeToutiaoGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "toutiao_app_get_article_info",
  method: "GET",
  path: "/api/v1/toutiao/app/get_article_info",
}

export const tikhub_toutiao_article_info: ToolDefinition = {
  name: "tikhub_toutiao_article_info",
  display_name: {
    en_US: "Toutiao · Article Info",
    zh_Hans: "今日头条 · 文章信息",
  },
  description: {
    en_US: "Fetch metadata and content fields for a known Toutiao article.",
    zh_Hans: "获取已知今日头条文章的元数据和正文相关字段。",
  },
  icon: "📰",
  parameters: [credentialParameter, groupIdParameter("article")],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeToutiaoGet(endpoint, args, {
      group_id: readTrimmedRequired(p, "group_id", "group_id"),
    })
  },
}
