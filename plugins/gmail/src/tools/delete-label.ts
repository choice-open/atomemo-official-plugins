import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  labelIdParam,
} from "./_shared/parameters"
import deleteLabelSkill from "./delete-label-skill.md" with { type: "text" }

export const deleteLabelTool: ToolDefinition = {
  name: "gmail-delete-label",
  display_name: t("GMAIL_TOOL_DELETE_LABEL_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DELETE_LABEL_DESCRIPTION"),
  skill: deleteLabelSkill,
  icon: "🏷️",
  parameters: [gmailCredentialParam, userIdParam, labelIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.labels.delete({
      userId,
      id: args.parameters.label_id,
    })
    return { success: true }
  },
}
