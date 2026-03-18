import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  draftIdParam,
} from "./_shared/parameters"

export const getDraftTool: ToolDefinition = {
  name: "gmail-get-draft",
  display_name: t("GMAIL_TOOL_GET_DRAFT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_DRAFT_DESCRIPTION"),
  icon: "📝",
  parameters: [gmailCredentialParam, userIdParam, draftIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.drafts.get({
      userId,
      id: args.parameters.draft_id,
      format: "full",
    })
    return { draft: res.data } as any
  },
}
