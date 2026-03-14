import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireGmailClient } from "../lib/require-gmail"
import { gmailCredentialParam, userIdParam } from "./_shared/parameters"

export const listForwardingAddressesTool: ToolDefinition = {
  name: "gmail-list-forwarding-addresses",
  display_name: t("GMAIL_TOOL_LIST_FORWARDING_ADDRESSES_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_LIST_FORWARDING_ADDRESSES_DESCRIPTION"),
  icon: "↪️",
  parameters: [gmailCredentialParam, userIdParam],
  async invoke({ args }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.settings.forwardingAddresses.list({ userId })
    return { forwardingAddresses: res.data.forwardingAddresses } as any
  },
}
