import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
} from "./_shared/parameters"
import { toStringArray } from "../lib/to-string-array"

export const watchTool: ToolDefinition = {
  name: "gmail-watch",
  display_name: t("GMAIL_TOOL_WATCH_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_WATCH_DESCRIPTION"),
  icon: "👁️",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    {
      name: "topic_name",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_TOPIC_NAME_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_TOPIC_NAME_HINT"),
        placeholder: t("GMAIL_PARAM_TOPIC_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "label_ids",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_LABEL_IDS_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_LABEL_IDS_HINT"),
        placeholder: t("GMAIL_PARAM_LABEL_IDS_PLACEHOLDER"),
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
    const labelIds = toStringArray(args.parameters.label_ids as string | string[] | undefined)
    const res = await gmail.users.watch({
      userId,
      requestBody: {
        topicName: args.parameters.topic_name,
        labelIds: labelIds,
      },
    })
    return {
      expiration: res.data.expiration,
      historyId: res.data.historyId,
    } as any
  },
}
