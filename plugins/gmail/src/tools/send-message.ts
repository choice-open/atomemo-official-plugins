import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { encodeSubject } from "../lib/rfc2047"
import {
  gmailCredentialParam,
  userIdParam,
} from "./_shared/parameters"

function createRawEmail(to: string, subject: string, body: string, cc?: string, bcc?: string): string {
  const lines: string[] = []
  lines.push(`To: ${to}`)
  lines.push(`Subject: ${encodeSubject(subject)}`)
  if (cc) lines.push(`Cc: ${cc}`)
  if (bcc) lines.push(`Bcc: ${bcc}`)
  lines.push("Content-Type: text/html; charset=utf-8")
  lines.push("")
  lines.push(body.replace(/\n/g, "<br>"))
  return Buffer.from(lines.join("\r\n")).toString("base64url")
}

export const sendMessageTool: ToolDefinition = {
  name: "gmail-send-message",
  display_name: t("GMAIL_TOOL_SEND_MESSAGE_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_SEND_MESSAGE_DESCRIPTION"),
  icon: "📤",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "to",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_TO_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_TO_HINT"),
        placeholder: t("GMAIL_PARAM_TO_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "subject",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_SUBJECT_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_SUBJECT_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "body",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_BODY_LABEL"),
      ui: {
        component: "textarea",
        hint: t("GMAIL_PARAM_BODY_HINT"),
        placeholder: t("GMAIL_PARAM_BODY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cc",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_CC_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_CC_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "bcc",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_BCC_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_BCC_HINT"),
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
    const raw = createRawEmail(
      args.parameters.to,
      args.parameters.subject,
      args.parameters.body,
      args.parameters.cc,
      args.parameters.bcc,
    )
    const res = await gmail.users.messages.send({
      userId,
      requestBody: { raw },
    })
    return { message: res.data, id: res.data.id } as any
  },
}
