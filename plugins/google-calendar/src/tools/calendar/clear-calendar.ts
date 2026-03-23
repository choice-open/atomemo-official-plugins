import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const clearCalendarTool: ToolDefinition = {
  name: "clear-calendar",
  display_name: t("CLEAR_CALENDAR_DISPLAY_NAME"),
  description: t("CLEAR_CALENDAR_DESCRIPTION"),
  icon: "🧹",
  parameters: [calendarCredentialParam, calendarIdParam],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const client = requireCalendarClient(credentials, parameters.credential_id)

    const res = await client.calendars.clear({
      calendarId: parameters.calendar_id,
    })
    return sanitizeObject(res.data)
  },
}
