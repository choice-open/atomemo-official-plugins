import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_post_by_url",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_post_by_url",
}

export const tikhub_instagram_post_by_url: ToolDefinition = {
  name: "tikhub_instagram_post_by_url",
  display_name: {
    en_US: "Instagram · Post by URL",
    zh_Hans: "Instagram · 按 URL 获取帖子",
  },
  description: {
    en_US: "Fetch full Instagram post details by post URL.",
    zh_Hans: "通过帖子 URL 获取 Instagram 帖子完整详情。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "post_url",
      required: true,
      displayName: { en_US: "Post URL", zh_Hans: "帖子 URL" },
      hint: {
        en_US: "Required Instagram post URL.",
        zh_Hans: "必填 Instagram 帖子 URL。",
      },
      llmDescription: {
        en_US:
          "Required Instagram post URL. This tool uses the base V1 endpoint for fuller post data.",
        zh_Hans:
          "必填 Instagram 帖子 URL。本工具使用 V1 基础接口以获取更完整帖子数据。",
      },
      placeholder: {
        en_US: "https://www.instagram.com/p/DPwhVB-jo9k/",
        zh_Hans: "https://www.instagram.com/p/DPwhVB-jo9k/",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      post_url: readTrimmedRequired(p, "post_url", "post_url"),
    })
  },
}
