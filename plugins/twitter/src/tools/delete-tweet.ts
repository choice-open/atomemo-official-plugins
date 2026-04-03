import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { tweetIdParam, twitterCredentialParam } from "./_shared/parameters"

export const deleteTweetTool = {
  name: "twitter-delete-tweet",
  display_name: t("TWITTER_TOOL_DELETE_TWEET_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_DELETE_TWEET_DESCRIPTION"),
  icon: "🗑️",
  skill: getSkill("delete-tweet"),
  parameters: [twitterCredentialParam, tweetIdParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const res = await client.posts.delete(args.parameters.tweet_id)
    return { data: res.data } as any
  },
} satisfies ToolDefinition
