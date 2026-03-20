import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"

export const updateVacationTool: ToolDefinition = {
  name: "gmail-update-vacation",
  display_name: t("GMAIL_TOOL_UPDATE_VACATION_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_UPDATE_VACATION_DESCRIPTION"),
  icon: "🏖️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "enable_auto_reply",
      type: "boolean",
      required: true,
      display_name: t("GMAIL_PARAM_ENABLE_AUTO_REPLY_LABEL"),
      ui: { component: "switch", support_expression: true },
    },
    {
      name: "response_subject",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_RESPONSE_SUBJECT_LABEL"),
      ui: { component: "input", width: "full", support_expression: true },
    },
    {
      name: "response_body",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_RESPONSE_BODY_LABEL"),
      ui: { component: "textarea", width: "full", support_expression: true },
    },
    {
      name: "restrict_to_contacts",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("GMAIL_PARAM_RESTRICT_TO_CONTACTS_LABEL"),
      ui: { component: "switch", width: "full", support_expression: true },
    },
    {
      name: "restrict_to_domain",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("GMAIL_PARAM_RESTRICT_TO_DOMAIN_LABEL"),
      ui: { component: "switch", width: "full", support_expression: true },
    },
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.settings.updateVacation({
      userId,
      requestBody: {
        enableAutoReply: args.parameters.enable_auto_reply,
        responseSubject: args.parameters.response_subject,
        responseBodyPlainText: args.parameters.response_body,
        restrictToContacts: args.parameters.restrict_to_contacts,
        restrictToDomain: args.parameters.restrict_to_domain,
      },
    })
    return { vacation: res.data } as any
  },
}
