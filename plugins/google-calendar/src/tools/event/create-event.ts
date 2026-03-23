import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const createEventTool: ToolDefinition = {
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
      name: "is_all_day_event",
      type: "boolean",
      required: false,
      display_name: t("IS_ALL_DAY_EVENT_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("IS_ALL_DAY_EVENT_HINT"),
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
      display: {
        show: { is_all_day_event: { $eq: false } },
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
      display: {
        show: { is_all_day_event: { $eq: false } },
      },
    },
    {
      name: "start_date",
      type: "string",
      required: true,
      display_name: t("START_DATE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("START_DATE_HINT"),
        placeholder: t("START_DATE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: true } },
      },
    },
    {
      name: "end_date",
      type: "string",
      required: true,
      display_name: t("END_DATE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("END_DATE_HINT"),
        placeholder: t("END_DATE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: true } },
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
      display: {
        show: { is_all_day_event: { $eq: false } },
      },
    },
    {
      name: "include_details",
      type: "boolean",
      required: false,
      display_name: t("INCLUDE_DETAILS_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("INCLUDE_DETAILS_HINT"),
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
      display: {
        show: { include_details: { $eq: true } },
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
      display: {
        show: { include_details: { $eq: true } },
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(args.credentials, args.parameters.credential_id)
    const params = args.parameters
    const {
      calendar_id,
      summary,
      description,
      location,
      is_all_day_event,
      start_datetime,
      end_datetime,
      start_date,
      end_date,
      timezone,
    } = params

    const tz = (timezone as string) || "UTC"

    if (is_all_day_event) {
      if (!start_date || !end_date) {
        throw new Error("Start date and end date are required for all-day events")
      }
    } else {
      if (!start_datetime || !end_datetime) {
        throw new Error("Start time and end time are required for timed events")
      }
    }

    const requestBody: Record<string, unknown> = {
      summary: summary as string,
      description: (description as string) || undefined,
      location: (location as string) || undefined,
    }

    if (is_all_day_event) {
      requestBody.start = { date: start_date as string }
      requestBody.end = { date: end_date as string }
    } else {
      requestBody.start = { dateTime: start_datetime as string, timeZone: tz }
      requestBody.end = { dateTime: end_datetime as string, timeZone: tz }
    }

    const res = await calendar.events.insert({
      calendarId: calendar_id as string,
      requestBody,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
