import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createCalendarClient } from "../lib/calendar-client"
import type { GoogleCalendarCredential } from "../lib/calendar-client"
import { t } from "../i18n/i18n-node"

export const createEventTool = {
  name: "create-event",
  display_name: t("CREATE_EVENT_DISPLAY_NAME"),
  description: t("CREATE_EVENT_DESCRIPTION"),
  icon: "➕",
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
      name: "summary",
      type: "string",
      required: true,
      display_name: t("SUMMARY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SUMMARY_HINT"),
        placeholder: t("SUMMARY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: t("DESCRIPTION_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        hint: t("DESCRIPTION_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "location",
      type: "string",
      required: false,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "start_datetime",
      type: "string",
      required: true,
      display_name: t("START_DATETIME_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("START_DATETIME_HINT"),
        support_expression: true,
      },
    },
    {
      name: "end_datetime",
      type: "string",
      required: true,
      display_name: t("END_DATETIME_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("END_DATETIME_HINT"),
        support_expression: true,
      },
    },
    {
      name: "timezone",
      type: "string",
      required: false,
      display_name: t("TIMEZONE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIMEZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const cred = args.credentials.credential as GoogleCalendarCredential
    const {
      calendar_id,
      summary,
      description,
      location,
      start_datetime,
      end_datetime,
      timezone,
    } = args.parameters

    const tz = (timezone as string) || "UTC"

    const calendar = createCalendarClient(cred)
    const res = await calendar.events.insert({
      calendarId: calendar_id as string,
      requestBody: {
        summary: summary as string,
        description: (description as string) || undefined,
        location: (location as string) || undefined,
        start: {
          dateTime: start_datetime as string,
          timeZone: tz,
        },
        end: {
          dateTime: end_datetime as string,
          timeZone: tz,
        },
      },
    })

    const e = res.data
    return {
      id: e.id,
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.start,
      end: e.end,
      htmlLink: e.htmlLink,
      status: e.status,
    }
  },
} satisfies ToolDefinition
