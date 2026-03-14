import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"

export const stopTool: ToolDefinition = {
  name: "gmail-stop",
  display_name: t("GMAIL_TOOL_STOP_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_STOP_DESCRIPTION"),
  icon: "⏹️",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.stop({ userId })
    return { success: true }
  },
}
