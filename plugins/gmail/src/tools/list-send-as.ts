import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"
import listSendAsSkill from "./list-send-as-skill.md" with { type: "text" }

export const listSendAsTool: ToolDefinition = {
  name: "gmail-list-send-as",
  display_name: t("GMAIL_TOOL_LIST_SEND_AS_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_SEND_AS_DESCRIPTION"),
  skill: listSendAsSkill,
  icon: "📧",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.settings.sendAs.list({ userId })
    return { sendAs: res.data.sendAs } as any
  },
}
