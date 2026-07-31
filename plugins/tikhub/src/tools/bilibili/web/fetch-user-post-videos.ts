import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliIntegerParameter,
  bilibiliSelectParameter,
  credentialParameter,
  invokeBilibiliGet,
  readPageNumber,
  readTrimmedRequired,
  readUserVideoOrder,
  uidParameter,
  userVideoOrderValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_user_post_videos",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_user_post_videos",
}

export const tikhub_bilibili_user_videos: ToolDefinition = {
  name: "tikhub_bilibili_user_videos",
  display_name: {
    en_US: "Bilibili · User Videos",
    zh_Hans: "哔哩哔哩 · 用户投稿视频",
  },
  description: {
    en_US: "Fetch posted videos from a Bilibili user homepage.",
    zh_Hans: "获取 Bilibili 用户主页投稿视频。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    uidParameter,
    bilibiliIntegerParameter({
      name: "pn",
      default: 1,
      minimum: 1,
      displayName: { en_US: "Page Number", zh_Hans: "页码" },
      hint: {
        en_US: "OpenAPI default 1.",
        zh_Hans: "OpenAPI 默认 1。",
      },
      llmDescription: {
        en_US: "User videos page number. OpenAPI default is 1.",
        zh_Hans: "用户投稿视频页码。OpenAPI 默认 1。",
      },
    }),
    bilibiliSelectParameter({
      name: "order",
      values: userVideoOrderValues,
      default: "pubdate",
      displayName: { en_US: "Order", zh_Hans: "排序方式" },
      hint: {
        en_US:
          "OpenAPI default pubdate. pubdate=latest, click=views, stow=favorites.",
        zh_Hans:
          "OpenAPI 默认 pubdate。pubdate 最新，click 播放量，stow 收藏量。",
      },
      llmDescription: {
        en_US:
          "User video sort order. Allowed values are pubdate, click, and stow.",
        zh_Hans: "用户投稿排序方式。只允许 pubdate、click、stow。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      uid: readTrimmedRequired(p, "uid", "uid"),
      pn: String(readPageNumber(p)),
      order: readUserVideoOrder(p),
    })
  },
}
