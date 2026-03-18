import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
} from "./_shared/parameters"

export const batchDeleteMessagesTool: ToolDefinition = {
  name: "gmail-batch-delete-messages",
  display_name: t("GMAIL_TOOL_BATCH_DELETE_MESSAGES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_BATCH_DELETE_MESSAGES_DESCRIPTION"),
  icon: "🗑️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "message_ids",
      type: "array",
      required: true,
      display_name: t("GMAIL_PARAM_MESSAGE_IDS_LABEL"),
      items: { name: "item", type: "string" },
      ui: {
        component: "tag-input",
        hint: t("GMAIL_PARAM_MESSAGE_IDS_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.messages.batchDelete({
      userId,
      requestBody: { ids: args.parameters.message_ids },
    })
    return { success: true }
  },
}
