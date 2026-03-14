import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  threadIdParam,
  labelIdsParam,
} from "./_shared/parameters"

export const modifyThreadTool: ToolDefinition = {
  name: "gmail-modify-thread",
  display_name: t("GMAIL_TOOL_MODIFY_THREAD_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_MODIFY_THREAD_DESCRIPTION"),
  icon: "🏷️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    threadIdParam,
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
    const res = await gmail.users.threads.modify({
      userId,
      id: args.parameters.thread_id,
      requestBody: {
        addLabelIds: args.parameters.add_label_ids,
        removeLabelIds: args.parameters.remove_label_ids,
      },
    })
    return { thread: res.data } as any
  },
}
