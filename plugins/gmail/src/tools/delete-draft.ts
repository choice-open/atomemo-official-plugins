import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  draftIdParam,
} from "./_shared/parameters"
import deleteDraftSkill from "./delete-draft-skill.md" with { type: "text" }

export const deleteDraftTool: ToolDefinition = {
  name: "gmail-delete-draft",
  display_name: t("GMAIL_TOOL_DELETE_DRAFT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DELETE_DRAFT_DESCRIPTION"),
  skill: deleteDraftSkill,
  icon: "🗑️",
  parameters: [gmailCredentialParam, userIdParam, draftIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.drafts.delete({
      userId,
      id: args.parameters.draft_id,
    })
    return { success: true }
  },
}
