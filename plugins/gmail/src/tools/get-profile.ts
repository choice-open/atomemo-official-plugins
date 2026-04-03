import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
} from "./_shared/parameters"
import getProfileSkill from "./get-profile-skill.md" with { type: "text" }

export const getProfileTool: ToolDefinition = {
  name: "gmail-get-profile",
  display_name: t("GMAIL_TOOL_GET_PROFILE_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_PROFILE_DESCRIPTION"),
  skill: getProfileSkill,
  icon: "👤",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.getProfile({ userId })
    return { profile: res.data } as any
  },
}
