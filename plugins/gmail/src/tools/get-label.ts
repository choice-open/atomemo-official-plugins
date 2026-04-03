import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  labelIdParam,
} from "./_shared/parameters"
import getLabelSkill from "./get-label-skill.md" with { type: "text" }

export const getLabelTool: ToolDefinition = {
  name: "gmail-get-label",
  display_name: t("GMAIL_TOOL_GET_LABEL_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_GET_LABEL_DESCRIPTION"),
  skill: getLabelSkill,
  icon: "🏷️",
  parameters: [gmailCredentialParam, userIdParam, labelIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.labels.get({
      userId,
      id: args.parameters.label_id,
    })
    return { label: res.data } as any
  },
}
