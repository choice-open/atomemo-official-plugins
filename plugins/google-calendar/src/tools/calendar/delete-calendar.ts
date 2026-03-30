import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParamDeleteOrInsert,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const deleteCalendarTool: ToolDefinition = {
  name: "delete-calendar",
  display_name: t("DELETE_CALENDAR_DISPLAY_NAME"),
  description: t("DELETE_CALENDAR_DESCRIPTION"),
  icon: "🗑️",
  parameters: [calendarCredentialParam, calendarIdParamDeleteOrInsert],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )

    const { calendar_id } = args.parameters
    if (calendar_id === "primary") {
      throw new Error("Cannot delete the primary calendar")
    }
    const res = await client.calendars.delete({
      calendarId: calendar_id as string,
    })
    return sanitizeObject(res.data)
  },
}
