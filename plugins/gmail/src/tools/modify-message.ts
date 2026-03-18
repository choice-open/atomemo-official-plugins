import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { toStringArray } from "../lib/to-string-array"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
  labelIdsParam,
} from "./_shared/parameters"

export const modifyMessageTool: ToolDefinition = {
  name: "gmail-modify-message",
  display_name: t("GMAIL_TOOL_MODIFY_MESSAGE_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_MODIFY_MESSAGE_DESCRIPTION"),
  icon: "🏷️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    messageIdParam,
    {
      ...labelIdsParam,
      name: "add_label_ids",
      display_name: t("GMAIL_PARAM_ADD_LABEL_IDS_LABEL"),
      ui: { ...labelIdsParam.ui, hint: t("GMAIL_PARAM_ADD_LABEL_IDS_HINT") },
    },
    {
      name: "remove_label_ids",
      type: "array",
      required: false,
      display_name: t("GMAIL_PARAM_REMOVE_LABEL_IDS_LABEL"),
      items: { name: "item", type: "string" },
      ui: {
        component: "tag-input",
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
    const addLabelIds = toStringArray(args.parameters.add_label_ids as string | string[] | undefined)
    const removeLabelIds = toStringArray(args.parameters.remove_label_ids as string | string[] | undefined)
    if (addLabelIds.length === 0 && removeLabelIds.length === 0) {
      throw new Error("add_label_ids 与 remove_label_ids 至少需要提供一个")
    }
    const res = await gmail.users.messages.modify({
      userId,
      id: args.parameters.message_id,
      requestBody: {
        ...(addLabelIds.length > 0 && { addLabelIds }),
        ...(removeLabelIds.length > 0 && { removeLabelIds }),
      },
    })
    return { message: res.data } as any
  },
}
