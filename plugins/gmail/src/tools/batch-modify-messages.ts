import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  labelIdsParam,
} from "./_shared/parameters"

export const batchModifyMessagesTool: ToolDefinition = {
  name: "gmail-batch-modify-messages",
  display_name: t("GMAIL_TOOL_BATCH_MODIFY_MESSAGES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_BATCH_MODIFY_MESSAGES_DESCRIPTION"),
  icon: "🏷️",
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
    {
      ...labelIdsParam,
      name: "add_label_ids",
      display_name: t("GMAIL_PARAM_ADD_LABEL_IDS_LABEL"),
    },
    {
      name: "remove_label_ids",
      type: "array",
      required: false,
      display_name: t("GMAIL_PARAM_REMOVE_LABEL_IDS_LABEL"),
      items: { name: "item", type: "string" },
      ui: { component: "tag-input", width: "full" },
    },
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.messages.batchModify({
      userId,
      requestBody: {
        ids: args.parameters.message_ids,
        addLabelIds: args.parameters.add_label_ids,
        removeLabelIds: args.parameters.remove_label_ids,
      },
    })
    return { success: true }
  },
}
