import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  maxResultsParam,
  pageTokenParam,
} from "./_shared/parameters"

export const listDraftsTool: ToolDefinition = {
  name: "gmail-list-drafts",
  display_name: t("GMAIL_TOOL_LIST_DRAFTS_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_DRAFTS_DESCRIPTION"),
  icon: "📝",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    maxResultsParam,
    pageTokenParam,
  ],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.drafts.list({
      userId,
      maxResults: args.parameters.max_results,
      pageToken: args.parameters.page_token || undefined,
    })
    return {
      drafts: res.data.drafts,
      nextPageToken: res.data.nextPageToken,
      resultSizeEstimate: res.data.resultSizeEstimate,
    } as any
  },
}
