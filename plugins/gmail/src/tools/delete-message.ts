import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
} from "./_shared/parameters"

export const deleteMessageTool: ToolDefinition = {
  name: "gmail-delete-message",
  display_name: t("GMAIL_TOOL_DELETE_MESSAGE_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DELETE_MESSAGE_DESCRIPTION"),
  icon: "🗑️",
  parameters: [gmailCredentialParam, userIdParam, messageIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.messages.delete({
      userId,
      id: args.parameters.message_id,
    })
    return { success: true }
  },
}
