import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  threadIdParam,
  labelIdsParam,
} from "./_shared/parameters"
import { toStringArray } from "../lib/to-string-array"
import modifyThreadSkill from "./modify-thread-skill.md" with { type: "text" }

export const modifyThreadTool: ToolDefinition = {
  name: "gmail-modify-thread",
  display_name: t("GMAIL_TOOL_MODIFY_THREAD_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_MODIFY_THREAD_DESCRIPTION"),
  skill: modifyThreadSkill,
  icon: "🏷️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    threadIdParam,
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
    const addLabelIds = toStringArray(args.parameters.add_label_ids as string | string[] | undefined)
    const removeLabelIds = toStringArray(args.parameters.remove_label_ids as string | string[] | undefined)
    const res = await gmail.users.threads.modify({
      userId,
      id: args.parameters.thread_id,
      requestBody: {
        addLabelIds,
        removeLabelIds,
      },
    })
    return { thread: res.data } as any
  },
}
