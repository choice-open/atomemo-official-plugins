import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const listSettingsTool: ToolDefinition = {
  name: "list-settings",
  display_name: t("SETTINGS_LIST_DISPLAY_NAME"),
  description: t("SETTINGS_LIST_DESCRIPTION"),
  icon: "📋",
  parameters: [calendarCredentialParam],
  async invoke({ args }) {
    const client = requireCalendarClient(args.credentials, args.parameters.credential_id)

    const res = await client.settings.list()

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
