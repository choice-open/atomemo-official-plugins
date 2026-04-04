import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"
import getVacationSkill from "./get-vacation-skill.md" with { type: "text" }

export const getVacationTool: ToolDefinition = {
  name: "gmail-get-vacation",
  display_name: t("GMAIL_TOOL_GET_VACATION_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_VACATION_DESCRIPTION"),
  skill: getVacationSkill,
  icon: "🏖️",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.settings.getVacation({ userId })
    return { vacation: res.data } as any
  },
}
