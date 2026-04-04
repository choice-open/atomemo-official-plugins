import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"
import createLabelSkill from "./create-label-skill.md" with { type: "text" }

export const createLabelTool: ToolDefinition = {
  name: "gmail-create-label",
  display_name: t("GMAIL_TOOL_CREATE_LABEL_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_CREATE_LABEL_DESCRIPTION"),
  skill: createLabelSkill,
  icon: "🏷️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "name",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_LABEL_NAME_LABEL"),
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
    const res = await gmail.users.labels.create({
      userId,
      requestBody: {
        name: args.parameters.name,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    })
    return { label: res.data } as any
  },
}
