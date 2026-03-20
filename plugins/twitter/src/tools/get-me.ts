import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { twitterCredentialParam } from "./_shared/parameters"

export const getMeTool = {
  name: "twitter-get-me",
  display_name: t("TWITTER_TOOL_GET_ME_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_GET_ME_DESCRIPTION"),
  icon: "👤",
  skill: getSkill("get-me"),
  parameters: [twitterCredentialParam],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const res = await client.users.getMe({
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
