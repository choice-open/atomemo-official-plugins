import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createCalendarClient } from "../lib/calendar-client"
import type { GoogleCalendarCredential } from "../lib/calendar-client"
import { t } from "../i18n/i18n-node"

export const deleteEventTool = {
  name: "delete-event",
  display_name: t("DELETE_EVENT_DISPLAY_NAME"),
  description: t("DELETE_EVENT_DESCRIPTION"),
  icon: "🗑️",
  parameters: [
    {
      name: "credential",
      type: "credential_id",
      required: true,
      display_name: t("CREDENTIAL_DISPLAY_NAME"),
      credential_name: "google-calendar-oauth2",
    },
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
  ],
  async invoke({ args }) {
    const cred = args.credentials.credential as GoogleCalendarCredential
    const { calendar_id, event_id } = args.parameters

    const calendar = createCalendarClient(cred)
    await calendar.events.delete({
      calendarId: calendar_id as string,
      eventId: event_id as string,
    })

    return { success: true, deleted_event_id: event_id }
  },
} satisfies ToolDefinition
