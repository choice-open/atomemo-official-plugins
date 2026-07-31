import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramIntegerParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readCount,
  readOptionalStringParam,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_user_tagged_posts",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_user_tagged_posts",
}

export const tikhub_instagram_user_tagged_posts: ToolDefinition = {
  name: "tikhub_instagram_user_tagged_posts",
  display_name: {
    en_US: "Instagram · Tagged Posts",
    zh_Hans: "Instagram · 用户被标记帖子",
  },
  description: {
    en_US: "Fetch posts where an Instagram user is tagged.",
    zh_Hans: "获取 Instagram 用户被标记的帖子列表。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "user_id",
      required: true,
      displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
      hint: {
        en_US: "Required Instagram user ID. Keep it as a string.",
        zh_Hans: "必填 Instagram 用户 ID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Instagram user ID. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Instagram 用户 ID。按字符串处理，不要转成数字。",
      },
      placeholder: { en_US: "25025320", zh_Hans: "25025320" },
    }),
    instagramIntegerParameter({
      name: "count",
      default: 12,
      minimum: 1,
      maximum: 50,
      displayName: { en_US: "Count", zh_Hans: "每页数量" },
      hint: {
        en_US: "OpenAPI default 12. Valid range: 1 to 50.",
        zh_Hans: "OpenAPI 默认 12。有效范围：1 到 50。",
      },
      llmDescription: {
        en_US:
          "Number of tagged posts per page. OpenAPI default is 12, range 1-50.",
        zh_Hans: "每页被标记帖子数量。OpenAPI 默认 12，范围 1-50。",
      },
    }),
    instagramStringParameter({
      name: "end_cursor",
      displayName: { en_US: "End Cursor", zh_Hans: "分页 end_cursor" },
      hint: {
        en_US: "Optional opaque pagination cursor. Pass end_cursor unchanged.",
        zh_Hans: "可选不透明分页 cursor。翻页时原样传回 end_cursor。",
      },
      llmDescription: {
        en_US:
          "Opaque pagination cursor for tagged posts. Do not parse, decode, or rewrite it.",
        zh_Hans: "被标记帖子分页 cursor。不要解析、解码或改写。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      user_id: readTrimmedRequired(p, "user_id", "user_id"),
      count: String(readCount(p)),
      end_cursor: readOptionalStringParam(p, "end_cursor"),
    })
  },
}
