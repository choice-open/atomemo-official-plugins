import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  maxResultsParam,
  pageTokenParam,
  qParam,
  labelIdsParam,
} from "./_shared/parameters"
import listMessagesSkill from "./list-messages-skill.md" with { type: "text" }

export const listMessagesTool: ToolDefinition = {
  name: "gmail-list-messages",
  display_name: t("GMAIL_TOOL_LIST_MESSAGES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_MESSAGES_DESCRIPTION"),
  skill: listMessagesSkill,
  icon: "📬",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    qParam,
    labelIdsParam,
    maxResultsParam,
    pageTokenParam,
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.messages.list({
      userId,
      q: args.parameters.q || undefined,
      labelIds: args.parameters.label_ids?.length
        ? args.parameters.label_ids
        : undefined,
      maxResults: args.parameters.max_results,
      pageToken: args.parameters.page_token || undefined,
    })
    return {
      messages: res.data.messages ?? [],
      nextPageToken: res.data.nextPageToken ?? null,
      resultSizeEstimate: res.data.resultSizeEstimate ?? null,
    } as any
  },
}
