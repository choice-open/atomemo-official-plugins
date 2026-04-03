import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"
import listDelegatesSkill from "./list-delegates-skill.md" with { type: "text" }

export const listDelegatesTool: ToolDefinition = {
  name: "gmail-list-delegates",
  display_name: t("GMAIL_TOOL_LIST_DELEGATES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_DELEGATES_DESCRIPTION"),
  skill: listDelegatesSkill,
  icon: "👥",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.settings.delegates.list({ userId })
    return { delegates: res.data.delegates } as any
  },
}
