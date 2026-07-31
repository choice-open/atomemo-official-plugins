import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_post_by_id",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_post_by_id",
}

export const tikhub_instagram_post_by_id: ToolDefinition = {
  name: "tikhub_instagram_post_by_id",
  display_name: {
    en_US: "Instagram · Post by ID",
    zh_Hans: "Instagram · 按 ID 获取帖子",
  },
  description: {
    en_US: "Fetch Instagram post details by post ID.",
    zh_Hans: "通过帖子 ID 获取 Instagram 帖子详情。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "post_id",
      required: true,
      displayName: { en_US: "Post ID", zh_Hans: "帖子 ID" },
      hint: {
        en_US: "Required Instagram post ID. Keep it as a string.",
        zh_Hans: "必填 Instagram 帖子 ID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Instagram post ID. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Instagram 帖子 ID。按字符串处理，不要转成数字。",
      },
      placeholder: {
        en_US: "3742637871112032100",
        zh_Hans: "3742637871112032100",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      post_id: readTrimmedRequired(p, "post_id", "post_id"),
    })
  },
}
