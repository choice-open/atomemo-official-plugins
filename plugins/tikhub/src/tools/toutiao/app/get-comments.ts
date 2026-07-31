import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  groupIdParameter,
  invokeToutiaoGet,
  readTrimmedRequired,
  toutiaoStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "toutiao_app_get_comments",
  method: "GET",
  path: "/api/v1/toutiao/app/get_comments",
}

export const tikhub_toutiao_post_comments: ToolDefinition = {
  name: "tikhub_toutiao_post_comments",
  display_name: {
    en_US: "Toutiao · Post Comments",
    zh_Hans: "今日头条 · 作品评论",
  },
  description: {
    en_US: "Fetch comments for a known Toutiao article or video post.",
    zh_Hans: "获取已知今日头条文章或视频作品评论。",
  },
  icon: "📰",
  parameters: [
    credentialParameter,
    groupIdParameter("post"),
    toutiaoStringParameter({
      name: "offset",
      required: true,
      displayName: { en_US: "Offset", zh_Hans: "分页 offset" },
      hint: {
        en_US:
          'Required string offset. Use "0" for the first request, then increase by 20.',
        zh_Hans: '必填字符串 offset。首次请求使用 "0"，之后每页递增 20。',
      },
      llmDescription: {
        en_US:
          'Required comments pagination offset. OpenAPI declares it as a string; use "0" first and keep later offsets as strings.',
        zh_Hans:
          '必填评论分页 offset。OpenAPI 声明为 string；首次使用 "0"，后续 offset 也保持字符串。',
      },
      placeholder: { en_US: "0", zh_Hans: "0" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeToutiaoGet(endpoint, args, {
      group_id: readTrimmedRequired(p, "group_id", "group_id"),
      offset: readTrimmedRequired(p, "offset", "offset"),
    })
  },
}
