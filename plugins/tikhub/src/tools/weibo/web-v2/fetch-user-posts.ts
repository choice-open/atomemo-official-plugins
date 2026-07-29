import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  pageParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  uidParameter,
  userPostFeatureValues,
  weiboSelectParameter,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_posts",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_user_posts",
}

export const tikhub_weibo_user_posts: ToolDefinition = {
  name: "tikhub_weibo_user_posts",
  display_name: {
    en_US: "Weibo · Get User Posts",
    zh_Hans: "微博 · 获取用户微博",
  },
  description: {
    en_US:
      "Fetch historical Weibo posts for a user with page, feature, and since_id pagination.",
    zh_Hans: "根据 uid 获取用户历史微博，支持 page、feature 和 since_id 翻页。",
  },
  icon: "🗂️",
  parameters: [
    credentialParameter,
    uidParameter,
    pageParameter,
    weiboSelectParameter({
      name: "feature",
      values: userPostFeatureValues,
      default: "0",
      displayName: { en_US: "Feature Type", zh_Hans: "返回特征" },
      hint: {
        en_US:
          "Default 0. 0=10 basic, 1=20 extended, 2=20 image-related, 3=20 video-related.",
        zh_Hans:
          "默认 0。0=10 条基础，1=20 条扩展，2=20 条图片相关，3=20 条视频相关。",
      },
      llmDescription: {
        en_US:
          "Feature type. Valid values: 0 for 10 basic posts, 1 for 20 extended posts, 2 for 20 image-related posts, 3 for 20 video-related posts. Default is 0.",
        zh_Hans:
          "返回特征。有效值：0 返回 10 条基础数据，1 返回 20 条扩展数据，2 返回 20 条图片相关数据，3 返回 20 条视频相关数据。默认 0。",
      },
    }),
    weiboStringParameter({
      name: "since_id",
      required: false,
      default: "",
      displayName: { en_US: "Since ID", zh_Hans: "分页 since_id" },
      hint: {
        en_US:
          "Leave empty for the first request. For pagination, pass the since_id from the previous response unchanged.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 since_id。",
      },
      llmDescription: {
        en_US:
          "Opaque pagination identifier for user posts. Pass it exactly as returned; do not parse or rewrite it.",
        zh_Hans:
          "用户微博不透明分页标识。必须原样传入上次响应返回的 since_id，不要解析或改写。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      uid: readOptionalStringParam(p, "uid"),
      page: readOptionalIntegerParam(p, "page") ?? "1",
      feature: readOptionalStringParam(p, "feature") ?? "0",
      since_id: readOptionalStringParam(p, "since_id") ?? "",
    })
  },
}
