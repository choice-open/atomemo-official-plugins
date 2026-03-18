import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createCalendarClient } from "../lib/calendar-client"
import type { GoogleCalendarCredential } from "../lib/calendar-client"
import { t } from "../i18n/i18n-node"

export const getEventTool = {
  name: "get-event",
  display_name: t("GET_EVENT_DISPLAY_NAME"),
  description: t("GET_EVENT_DESCRIPTION"),
  icon: "🔍",
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
    const res = await calendar.events.get({
      calendarId: calendar_id as string,
      eventId: event_id as string,
    })

    const e = res.data
    return {
      id: e.id,
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.start,
      end: e.end,
      status: e.status,
      htmlLink: e.htmlLink,
      organizer: e.organizer,
      attendees: e.attendees,
      created: e.created,
      updated: e.updated,
    }
  },
} satisfies ToolDefinition
