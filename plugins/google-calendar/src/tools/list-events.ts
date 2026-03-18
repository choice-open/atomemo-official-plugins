import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createCalendarClient } from "../lib/calendar-client"
import type { GoogleCalendarCredential } from "../lib/calendar-client"
import { t } from "../i18n/i18n-node"

export const listEventsTool = {
  name: "list-events",
  display_name: t("LIST_EVENTS_DISPLAY_NAME"),
  description: t("LIST_EVENTS_DESCRIPTION"),
  icon: "📋",
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
      name: "time_min",
      type: "string",
      required: false,
      display_name: t("TIME_MIN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIME_MIN_HINT"),
        support_expression: true,
      },
    },
    {
      name: "time_max",
      type: "string",
      required: false,
      display_name: t("TIME_MAX_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIME_MAX_HINT"),
        support_expression: true,
      },
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      display_name: t("MAX_RESULTS_DISPLAY_NAME"),
      default: 100,
      minimum: 1,
      maximum: 2500,
      ui: {
        component: "number-input",
        hint: t("MAX_RESULTS_HINT"),
      },
    },
  ],
  async invoke({ args }) {
    const cred = args.credentials.credential as GoogleCalendarCredential
    const { calendar_id, time_min, time_max, max_results } = args.parameters

    const calendar = createCalendarClient(cred)
    const res = await calendar.events.list({
      calendarId: calendar_id as string,
      timeMin: time_min || undefined,
      timeMax: time_max || undefined,
      maxResults: max_results ?? 100,
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = (res.data.items ?? []).map((e) => ({
      id: e.id,
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.start,
      end: e.end,
      status: e.status,
      htmlLink: e.htmlLink,
      attendees: e.attendees?.map((a) => ({ email: a.email, responseStatus: a.responseStatus })),
    }))

    return {
      events,
      count: events.length,
    }
  },
} satisfies ToolDefinition
