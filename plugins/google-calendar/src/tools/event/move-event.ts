import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const moveEventTool: ToolDefinition = {
  name: "move-event",
  display_name: t("MOVE_EVENT_DISPLAY_NAME"),
  description: t("MOVE_EVENT_DESCRIPTION"),
  icon: "➡️",
  parameters: [
    calendarCredentialParam,
    {
      name: "calendar_id",
      type: "string",
      required: true,
      display_name: t("CALENDAR_ID_DISPLAY_NAME"),
      default: "primary",
      ui: {
        component: "input",
        hint: t("CALENDAR_ID_HINT"),
        placeholder: t("CALENDAR_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "event_id",
      type: "string",
      required: true,
      display_name: t("EVENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("EVENT_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "destination_calendar_id",
      type: "string",
      required: true,
      display_name: t("DESTINATION_CALENDAR_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DESTINATION_CALENDAR_HINT"),
        placeholder: t("CALENDAR_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id, destination_calendar_id } = args.parameters

    const res = await client.events.move({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      destination: destination_calendar_id as string,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
