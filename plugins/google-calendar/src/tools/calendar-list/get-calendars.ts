import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const getCalendarListTool: ToolDefinition = {
  name: "get-calendar-list",
  display_name: t("GET_CALENDAR_LIST_DISPLAY_NAME"),
  description: t("GET_CALENDAR_LIST_DESCRIPTION"),
  icon: "📋",
  parameters: [calendarCredentialParam, calendarIdParam],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )

    const res = await client.calendarList.get({
      calendarId: args.parameters.calendar_id,
    })
    return sanitizeObject(res.data)
  },
}
