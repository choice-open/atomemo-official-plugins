import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"
import listLabelsSkill from "./list-labels-skill.md" with { type: "text" }

export const listLabelsTool: ToolDefinition = {
  name: "gmail-list-labels",
  display_name: t("GMAIL_TOOL_LIST_LABELS_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_LABELS_DESCRIPTION"),
  skill: listLabelsSkill,
  icon: "🏷️",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.labels.list({ userId })
    return { labels: res.data.labels } as any
  },
}
