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

export const getFollowingTool = {
  name: "twitter-get-following",
  display_name: t("TWITTER_TOOL_GET_FOLLOWING_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_FOLLOWING_DESCRIPTION"),
  icon: "👥",
  skill: getSkill("get-following"),
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

    const res = await client.users.getFollowing(user_id, {
      userFields: [
        "created_at",
        "description",
        "public_metrics",
        "profile_image_url",
        "verified",
      ],
      maxResults: max_results,
      paginationToken: pagination_token || undefined,
    })
    return {
      data: res.data,
      meta: res.meta,
    } as any
  },
} satisfies ToolDefinition
