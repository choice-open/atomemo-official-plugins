import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { toStringArray } from "../lib/to-string-array"
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
    {
      ...labelIdsParam,
      name: "add_label_ids",
      display_name: t("GMAIL_PARAM_ADD_LABEL_IDS_LABEL"),
      ui: { ...labelIdsParam.ui, hint: t("GMAIL_PARAM_ADD_LABEL_IDS_HINT") },
    },
    {
      name: "remove_label_ids",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_REMOVE_LABEL_IDS_LABEL"),
      ui: {
        component: "input",
        placeholder: t("GMAIL_PARAM_REMOVE_LABEL_IDS_PLACEHOLDER"),
        support_expression: true,
        hint: t("GMAIL_PARAM_REMOVE_LABEL_IDS_HINT"),
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
    if (ids.length === 0) {
      throw new Error("message_ids 不能为空")
    }
    const addLabelIds = toStringArray(args.parameters.add_label_ids as string | string[] | undefined)
    const removeLabelIds = toStringArray(args.parameters.remove_label_ids as string | string[] | undefined)
    if (addLabelIds.length === 0 && removeLabelIds.length === 0) {
      throw new Error("add_label_ids 与 remove_label_ids 至少需要提供一个")
    }
    await gmail.users.messages.batchModify({
      userId,
      requestBody: {
        ids,
        ...(addLabelIds.length > 0 && { addLabelIds }),
        ...(removeLabelIds.length > 0 && { removeLabelIds }),
      },
    })
    return { success: true }
  },
}
