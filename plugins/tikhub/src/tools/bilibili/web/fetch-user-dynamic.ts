import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliStringParameter,
  credentialParameter,
  invokeBilibiliGet,
  readOptionalTrimmed,
  readTrimmedRequired,
  uidParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_user_dynamic",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_user_dynamic",
}

export const tikhub_bilibili_user_dynamics: ToolDefinition = {
  name: "tikhub_bilibili_user_dynamics",
  display_name: {
    en_US: "Bilibili · User Dynamics",
    zh_Hans: "哔哩哔哩 · 用户动态",
  },
  description: {
    en_US: "Fetch dynamic posts from a Bilibili user.",
    zh_Hans: "获取 Bilibili 用户动态列表。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    uidParameter,
    bilibiliStringParameter({
      name: "offset",
      default: "",
      displayName: { en_US: "Offset", zh_Hans: "动态 offset" },
      hint: {
        en_US:
          "Leave empty for the first page. Pass returned offsets unchanged.",
        zh_Hans: "首页留空。翻页时将响应返回的 offset 原样传回。",
      },
      llmDescription: {
        en_US:
          "Opaque dynamic pagination offset. Do not parse, decode, rewrite, or synthesize it.",
        zh_Hans: "不透明动态分页 offset。不要解析、解码、改写或自行生成。",
      },
      placeholder: {
        en_US: "953154282154098691",
        zh_Hans: "953154282154098691",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      uid: readTrimmedRequired(p, "uid", "uid"),
      offset: readOptionalTrimmed(p, "offset"),
    })
  },
}
