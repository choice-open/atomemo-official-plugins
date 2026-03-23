import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const listCalendarsTool: ToolDefinition = {
  name: "list-calendars",
  display_name: t("LIST_CALENDARS_DISPLAY_NAME"),
  description: t("LIST_CALENDARS_DESCRIPTION"),
  icon: "📆",
  parameters: [
    calendarCredentialParam,
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(args.credentials, args.parameters.credential_id)

    const res = await calendar.calendarList.list()

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
