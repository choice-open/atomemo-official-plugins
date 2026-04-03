import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  labelIdParam,
} from "./_shared/parameters"
import updateLabelSkill from "./update-label-skill.md" with { type: "text" }

export const updateLabelTool: ToolDefinition = {
  name: "gmail-update-label",
  display_name: t("GMAIL_TOOL_UPDATE_LABEL_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_UPDATE_LABEL_DESCRIPTION"),
  skill: updateLabelSkill,
  icon: "🏷️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    labelIdParam,
    {
      name: "name",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_LABEL_NAME_LABEL"),
      ui: { component: "input", support_expression: true, width: "full" },
    },
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.labels.update({
      userId,
      id: args.parameters.label_id,
      requestBody: { name: args.parameters.name },
    })
    return { label: res.data } as any
  },
}
