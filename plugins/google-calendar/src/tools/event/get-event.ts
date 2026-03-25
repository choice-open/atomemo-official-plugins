import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import { t } from "../../i18n/i18n-node"

export const getEventTool: ToolDefinition = {
  name: "get-event",
  display_name: t("GET_EVENT_DISPLAY_NAME"),
  description: t("GET_EVENT_DESCRIPTION"),
  icon: "🔍",
  parameters: [calendarCredentialParam, calendarIdParam, eventIdParam],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id } = args.parameters

    const res = await calendar.events.get({
      calendarId: calendar_id as string,
      eventId: event_id as string,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
