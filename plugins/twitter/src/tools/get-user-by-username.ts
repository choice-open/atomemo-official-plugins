import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { twitterCredentialParam, usernameParam } from "./_shared/parameters"

export const getUserByUsernameTool = {
  name: "twitter-get-user-by-username",
  display_name: t("TWITTER_TOOL_GET_USER_BY_USERNAME_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_USER_BY_USERNAME_DESCRIPTION"),
  icon: "👤",
  skill: getSkill("get-user-by-username"),
  parameters: [twitterCredentialParam, usernameParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const res = await client.users.getByUsername(args.parameters.username, {
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
