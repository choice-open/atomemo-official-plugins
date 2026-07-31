import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readHashtag,
  readOptionalStringParam,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_hashtag_posts",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_hashtag_posts",
}

export const tikhub_instagram_hashtag_posts: ToolDefinition = {
  name: "tikhub_instagram_hashtag_posts",
  display_name: {
    en_US: "Instagram · Hashtag Posts",
    zh_Hans: "Instagram · 话题帖子",
  },
  description: {
    en_US: "Fetch Instagram posts under a hashtag.",
    zh_Hans: "获取 Instagram 话题标签下的帖子。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "hashtag",
      required: true,
      displayName: { en_US: "Hashtag", zh_Hans: "话题标签" },
      hint: {
        en_US: "Required hashtag name without the # prefix.",
        zh_Hans: "必填话题标签名称，不带 # 前缀。",
      },
      llmDescription: {
        en_US: "Required Instagram hashtag name. Do not include the # prefix.",
        zh_Hans: "必填 Instagram 话题标签名称，不要包含 # 前缀。",
      },
      placeholder: { en_US: "cat", zh_Hans: "cat" },
    }),
    instagramStringParameter({
      name: "end_cursor",
      displayName: { en_US: "End Cursor", zh_Hans: "分页 end_cursor" },
      hint: {
        en_US:
          "Optional opaque pagination cursor. Pass the returned end_cursor unchanged.",
        zh_Hans: "可选不透明分页 cursor。翻页时原样传回 end_cursor。",
      },
      llmDescription: {
        en_US:
          "Opaque pagination cursor for hashtag posts. Do not parse, decode, or rewrite it.",
        zh_Hans: "话题帖子分页 cursor。不要解析、解码或改写。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      hashtag: readHashtag(p),
      end_cursor: readOptionalStringParam(p, "end_cursor"),
    })
  },
}
