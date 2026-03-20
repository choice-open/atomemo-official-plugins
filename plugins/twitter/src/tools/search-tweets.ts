import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import {
  maxResultsParam,
  paginationTokenParam,
  queryParam,
  twitterCredentialParam,
} from "./_shared/parameters"

export const searchTweetsTool = {
  name: "twitter-search-tweets",
  display_name: t("TWITTER_TOOL_SEARCH_TWEETS_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_SEARCH_TWEETS_DESCRIPTION"),
  icon: "🔎",
  skill: getSkill("search-tweets"),
  parameters: [
    twitterCredentialParam,
    queryParam,
    maxResultsParam,
    paginationTokenParam,
  ],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const { query, max_results, pagination_token } = args.parameters

    const res = await client.posts.searchRecent(query, {
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
