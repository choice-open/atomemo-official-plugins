import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import getCalendarSkill from "./get-calendar-skill.md" with { type: "text" }

export const getCalendarTool: ToolDefinition = {
  name: "get-calendar",
  display_name: t("GET_CALENDAR_DISPLAY_NAME"),
  description: t("GET_CALENDAR_DESCRIPTION"),
  skill: getCalendarSkill,
  icon: "📅",
  parameters: [calendarCredentialParam, calendarIdParam],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )

    const { calendar_id } = args.parameters

    const res = await client.calendars.get({
      calendarId: calendar_id as string,
    })

    return sanitizeObject(res.data)
  },
}
