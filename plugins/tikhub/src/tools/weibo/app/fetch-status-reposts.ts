import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  optionalMaxIdParameter,
  readOptionalStringParam,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_status_reposts",
  method: "GET",
  path: "/api/v1/weibo/app/fetch_status_reposts",
}

export const tikhub_weibo_post_reposts: ToolDefinition = {
  name: "tikhub_weibo_post_reposts",
  display_name: {
    en_US: "Weibo · Get Post Reposts",
    zh_Hans: "微博 · 获取转发用户",
  },
  description: {
    en_US:
      "Fetch repost users for a Weibo status using the App API supplemental endpoint.",
    zh_Hans: "使用 App API 补充接口，根据 status_id 获取微博转发列表。",
  },
  icon: "🔁",
  parameters: [
    credentialParameter,
    weiboStringParameter({
      name: "status_id",
      required: true,
      displayName: { en_US: "Status ID", zh_Hans: "微博 status_id" },
      hint: {
        en_US:
          "Weibo status ID, passed as a string to avoid numeric precision loss.",
        zh_Hans: "微博 status_id，以字符串传递，避免数字精度丢失。",
      },
      llmDescription: {
        en_US:
          "Weibo status_id used to fetch repost users. Provide it as a string; do not convert it to a number.",
        zh_Hans:
          "用于获取转发用户的微博 status_id。请以字符串提供，不要转换为数字。",
      },
    }),
    optionalMaxIdParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      status_id: readOptionalStringParam(p, "status_id"),
      max_id: readOptionalStringParam(p, "max_id"),
    })
  },
}
