import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { calendarCredentialParam } from "../lib/parameters"
import { requireCalendarClient } from "../lib/require-calendar"

export const createEventTool = {
  name: "create-event",
  display_name: t("CREATE_EVENT_DISPLAY_NAME"),
  description: t("CREATE_EVENT_DESCRIPTION"),
  icon: "➕",
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
    const calendar = requireCalendarClient(args.credentials, args.parameters.credential_id)
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
    const toJson = (dt: { date?: string | null; dateTime?: string | null; timeZone?: string | null } | null | undefined) =>
      dt ? { date: dt.date ?? null, dateTime: dt.dateTime ?? null, timeZone: dt.timeZone ?? null } : null
    return {
      id: e.id ?? null,
      summary: e.summary ?? null,
      description: e.description ?? null,
      location: e.location ?? null,
      start: toJson(e.start),
      end: toJson(e.end),
      htmlLink: e.htmlLink ?? null,
      status: e.status ?? null,
    }
  },
} satisfies ToolDefinition
