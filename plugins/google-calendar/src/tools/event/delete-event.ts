import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
  sendUpdatesParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"

export const deleteEventTool = {
  name: "delete-event",
  display_name: t("DELETE_EVENT_DISPLAY_NAME"),
  description: t("DELETE_EVENT_DESCRIPTION"),
  icon: "🗑️",
  parameters: [calendarCredentialParam, calendarIdParam, eventIdParam, sendUpdatesParam],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id, send_updates } = args.parameters
    await calendar.events.delete({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      sendUpdates: (send_updates as string) || undefined,
    })

    return { success: true, deleted_event_id: event_id }
  },
} satisfies ToolDefinition
