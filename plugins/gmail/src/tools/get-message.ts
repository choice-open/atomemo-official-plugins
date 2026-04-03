import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
} from "./_shared/parameters"
import getMessageSkill from "./get-message-skill.md" with { type: "text" }

export const getMessageTool: ToolDefinition = {
  name: "gmail-get-message",
  display_name: t("GMAIL_TOOL_GET_MESSAGE_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_MESSAGE_DESCRIPTION"),
  skill: getMessageSkill,
  icon: "✉️",
  parameters: [gmailCredentialParam, userIdParam, messageIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.messages.get({
      userId,
      id: args.parameters.message_id,
      format: "full",
    })
    return { message: res.data } as any
  },
}
