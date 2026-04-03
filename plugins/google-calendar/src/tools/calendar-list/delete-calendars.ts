import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  secondaryCalendarIdParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import deleteCalendarListSkill from "./delete-calendar-list-skill.md" with {
  type: "text",
}

export const deleteCalendarListTool: ToolDefinition = {
  name: "delete-calendar-list",
  display_name: t("DELETE_CALENDAR_LIST_DISPLAY_NAME"),
  description: t("DELETE_CALENDAR_LIST_DESCRIPTION"),
  skill: deleteCalendarListSkill,
  icon: "➖",
  parameters: [calendarCredentialParam, secondaryCalendarIdParam],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )

    const { calendar_id } = args.parameters
    if (calendar_id === "primary") {
      throw new Error("Cannot remove the primary calendar from the list")
    }
    const res = await client.calendarList.delete({
      calendarId: calendar_id as string,
    })

    return sanitizeObject(res.data)
  },
}
