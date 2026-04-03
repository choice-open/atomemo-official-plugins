import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  draftIdParam,
} from "./_shared/parameters"
import sendDraftSkill from "./send-draft-skill.md" with { type: "text" }

export const sendDraftTool: ToolDefinition = {
  name: "gmail-send-draft",
  display_name: t("GMAIL_TOOL_SEND_DRAFT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_SEND_DRAFT_DESCRIPTION"),
  skill: sendDraftSkill,
  icon: "📤",
  parameters: [gmailCredentialParam, userIdParam, draftIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const draft = await gmail.users.drafts.get({ userId, id: args.parameters.draft_id })
    const res = await gmail.users.drafts.send({
      userId,
      requestBody: { id: draft.data.id!, message: draft.data.message! },
    })
    return { message: res.data } as any
  },
}
