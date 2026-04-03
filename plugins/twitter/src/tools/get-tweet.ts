import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { tweetIdParam, twitterCredentialParam } from "./_shared/parameters"

export const getTweetTool = {
  name: "twitter-get-tweet",
  display_name: t("TWITTER_TOOL_GET_TWEET_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_TWEET_DESCRIPTION"),
  icon: "🔍",
  skill: getSkill("get-tweet"),
  parameters: [twitterCredentialParam, tweetIdParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const res = await client.posts.getById(args.parameters.tweet_id, {
      tweetFields: [
        "created_at",
        "public_metrics",
        "author_id",
        "conversation_id",
      ],
      expansions: ["author_id"],
      userFields: ["username", "name", "profile_image_url"],
    })
    return { data: res.data, includes: res.includes } as any
  },
} satisfies ToolDefinition
