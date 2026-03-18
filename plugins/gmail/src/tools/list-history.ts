import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  maxResultsParam,
  pageTokenParam,
  labelIdsParam,
} from "./_shared/parameters"

export const listHistoryTool: ToolDefinition = {
  name: "gmail-list-history",
  display_name: t("GMAIL_TOOL_LIST_HISTORY_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_HISTORY_DESCRIPTION"),
  icon: "📜",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "start_history_id",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_START_HISTORY_ID_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_START_HISTORY_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
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
    const res = await gmail.users.history.list({
      userId,
      startHistoryId: args.parameters.start_history_id,
      historyTypes: undefined,
      labelId: (args.parameters.label_ids as string[] | undefined)?.[0],
      maxResults: args.parameters.max_results,
      pageToken: args.parameters.page_token || undefined,
    })
    return {
      history: res.data.history ?? [],
      historyId: res.data.historyId ?? null,
      nextPageToken: res.data.nextPageToken ?? null,
    } as any
  },
}
