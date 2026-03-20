import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import {
  maxResultsParam,
  paginationTokenParam,
  twitterCredentialParam,
  userIdParam,
} from "./_shared/parameters"

export const getUserTweetsTool = {
  name: "twitter-get-user-tweets",
  display_name: t("TWITTER_TOOL_GET_USER_TWEETS_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_USER_TWEETS_DESCRIPTION"),
  icon: "📋",
  skill: getSkill("get-user-tweets"),
  parameters: [
    twitterCredentialParam,
    userIdParam,
    maxResultsParam,
    paginationTokenParam,
  ],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const { user_id, max_results, pagination_token } = args.parameters

    const res = await client.users.getPosts(user_id, {
      tweetFields: [
        "created_at",
        "public_metrics",
        "author_id",
        "conversation_id",
      ],
      expansions: ["author_id"],
      userFields: ["username", "name", "profile_image_url"],
      maxResults: max_results,
      paginationToken: pagination_token || undefined,
    })
    return {
      data: res.data,
      includes: res.includes,
      meta: res.meta,
    } as any
  },
} satisfies ToolDefinition
