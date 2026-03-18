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

export const listThreadsTool: ToolDefinition = {
  name: "gmail-list-threads",
  display_name: t("GMAIL_TOOL_LIST_THREADS_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_THREADS_DESCRIPTION"),
  icon: "🧵",
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
    const res = await gmail.users.threads.list({
      userId,
      q: args.parameters.q || undefined,
      labelIds: args.parameters.label_ids?.length
        ? args.parameters.label_ids
        : undefined,
      maxResults: args.parameters.max_results,
      pageToken: args.parameters.page_token || undefined,
    })
    return {
      threads: res.data.threads ?? [],
      nextPageToken: res.data.nextPageToken ?? null,
      resultSizeEstimate: res.data.resultSizeEstimate ?? null,
    } as any
  },
}
