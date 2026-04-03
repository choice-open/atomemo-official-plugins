import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { tweetIdParam, twitterCredentialParam } from "./_shared/parameters"

export const likeTweetTool = {
  name: "twitter-like-tweet",
  display_name: t("TWITTER_TOOL_LIKE_TWEET_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_LIKE_TWEET_DESCRIPTION"),
  icon: "❤️",
  skill: getSkill("like-tweet"),
  parameters: [twitterCredentialParam, tweetIdParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const me = await client.users.getMe()
    const userId = me.data?.id
    if (!userId) throw new Error("Failed to get authenticated user ID.")

    const res = await client.users.likePost(userId, {
      body: { tweetId: args.parameters.tweet_id },
    })
    return { data: res.data } as any
  },
} satisfies ToolDefinition
