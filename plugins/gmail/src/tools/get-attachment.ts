import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
} from "./_shared/parameters"

export const getAttachmentTool: ToolDefinition = {
  name: "gmail-get-attachment",
  display_name: t("GMAIL_TOOL_GET_ATTACHMENT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_ATTACHMENT_DESCRIPTION"),
  icon: "📎",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    messageIdParam,
    {
      name: "attachment_id",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_ATTACHMENT_ID_LABEL"),
      ui: {
        component: "input",
        support_expression: true,
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
    const res = await gmail.users.messages.attachments.get({
      userId,
      messageId: args.parameters.message_id,
      id: args.parameters.attachment_id,
    })
    return {
      data: res.data.data ?? null,
      size: res.data.size ?? null,
      attachmentId: res.data.attachmentId ?? null,
    } as any
  },
}
