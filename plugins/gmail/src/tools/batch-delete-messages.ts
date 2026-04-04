import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
} from "./_shared/parameters"
import { toStringArray } from "../lib/to-string-array"
import batchDeleteMessagesSkill from "./batch-delete-messages-skill.md" with { type: "text" }

export const batchDeleteMessagesTool: ToolDefinition = {
  name: "gmail-batch-delete-messages",
  display_name: t("GMAIL_TOOL_BATCH_DELETE_MESSAGES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_BATCH_DELETE_MESSAGES_DESCRIPTION"),
  skill: batchDeleteMessagesSkill,
  icon: "🗑️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "message_ids",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_MESSAGE_IDS_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_MESSAGE_IDS_HINT"),
        placeholder: t("GMAIL_PARAM_MESSAGE_IDS_PLACEHOLDER"),
        support_expression: true,
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
    const ids = toStringArray(args.parameters.message_ids as string | string[] | undefined)
    await gmail.users.messages.batchDelete({
      userId,
      requestBody: { ids },
    })
    return { success: true }
  },
}
