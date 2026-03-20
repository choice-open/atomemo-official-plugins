import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { twitterCredentialParam, userIdParam } from "./_shared/parameters"

export const getUserTool = {
  name: "twitter-get-user",
  display_name: t("TWITTER_TOOL_GET_USER_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_USER_DESCRIPTION"),
  icon: "👤",
  skill: getSkill("get-user"),
  parameters: [twitterCredentialParam, userIdParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const res = await client.users.getById(args.parameters.user_id, {
      userFields: [
        "created_at",
        "description",
        "public_metrics",
        "profile_image_url",
        "verified",
      ],
    })
    return { data: res.data } as any
  },
} satisfies ToolDefinition
