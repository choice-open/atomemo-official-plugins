import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  threadIdParam,
} from "./_shared/parameters"
import deleteThreadSkill from "./delete-thread-skill.md" with { type: "text" }

export const deleteThreadTool: ToolDefinition = {
  name: "gmail-delete-thread",
  display_name: t("GMAIL_TOOL_DELETE_THREAD_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DELETE_THREAD_DESCRIPTION"),
  skill: deleteThreadSkill,
  icon: "🗑️",
  parameters: [gmailCredentialParam, userIdParam, threadIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    await gmail.users.threads.delete({
      userId,
      id: args.parameters.thread_id,
    })
    return { success: true }
  },
}
