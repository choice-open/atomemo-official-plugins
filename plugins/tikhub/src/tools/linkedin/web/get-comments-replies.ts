import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_comments_replies",
  method: "GET",
  path: "/api/v1/linkedin/web/get_comments_replies",
}

export const tikhub_linkedin_get_comments_replies: ToolDefinition = {
  name: "tikhub_linkedin_get_comments_replies",
  display_name: {
    en_US: "LinkedIn · Get Comment Replies",
    zh_Hans: "LinkedIn · 获取评论回复",
  },
  description: {
    en_US: "Get replies to a specific comment on a LinkedIn post.",
    zh_Hans: "获取 LinkedIn 帖子中指定评论的回复列表。",
  },
  icon: "💼",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "tikhub-api-key",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "post_id",
      type: "string",
      required: true,
      display_name: { en_US: "Post ID", zh_Hans: "帖子ID" },
      ai: {
        llm_description: {
          en_US: "LinkedIn post ID.",
          zh_Hans: "LinkedIn 帖子 ID。",
        },
      },
      ui: { hint: { en_US: "LinkedIn post ID.", zh_Hans: "LinkedIn 帖子 ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Post ID", zh_Hans: "帖子ID" }, width: "full" },
    },
    {
      name: "comment_id",
      type: "string",
      required: true,
      display_name: { en_US: "Comment ID", zh_Hans: "评论ID" },
      ai: {
        llm_description: {
          en_US: "Comment ID to fetch replies for.",
          zh_Hans: "要获取回复的评论 ID。",
        },
      },
      ui: { hint: { en_US: "Comment ID to fetch replies for.", zh_Hans: "要获取回复的评论 ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Comment ID", zh_Hans: "评论ID" }, width: "full" },
    },
    {
      name: "previous_replies_token",
      type: "string",
      required: true,
      display_name: { en_US: "Previous Replies Token", zh_Hans: "上一组回复令牌" },
      ai: {
        llm_description: {
          en_US: "Token for the previous batch of replies. Use the token returned from the parent comment or previous page.",
          zh_Hans: "上一组回复的令牌。使用父评论或上一页返回的令牌。",
        },
      },
      ui: { hint: { en_US: "Token from the parent comment or previous page.", zh_Hans: "从父评论或上一页获取的令牌。" }, support_expression: true, component: "input", placeholder: { en_US: "Previous replies token", zh_Hans: "上一组回复令牌" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const postId = readRequiredStringParam(p, "post_id")
    const commentId = readRequiredStringParam(p, "comment_id")
    const previousRepliesToken = readRequiredStringParam(p, "previous_replies_token")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        post_id: postId,
        comment_id: commentId,
        previous_replies_token: previousRepliesToken,
      },
    })
  },
}
