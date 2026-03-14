import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  threadIdParam,
} from "./_shared/parameters"

export const trashThreadTool: ToolDefinition = {
  name: "gmail-trash-thread",
  display_name: t("GMAIL_TOOL_TRASH_THREAD_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_TRASH_THREAD_DESCRIPTION"),
  icon: "🗑️",
  parameters: [gmailCredentialParam, userIdParam, threadIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.threads.trash({
      userId,
      id: args.parameters.thread_id,
    })
    return { thread: res.data } as any
  },
}
