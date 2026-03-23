import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const updateEventTool: ToolDefinition = {
  name: "update-event",
  display_name: t("UPDATE_EVENT_DISPLAY_NAME"),
  description: t("UPDATE_EVENT_DESCRIPTION"),
  icon: "✏️",
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
      name: "update_time",
      type: "boolean",
      required: false,
      display_name: t("UPDATE_TIME_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("UPDATE_TIME_HINT"),
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
      name: "summary",
      type: "string",
      required: false,
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
    {
      name: "start_datetime",
      type: "string",
      required: false,
      display_name: t("START_DATETIME_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("START_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { update_time: { $eq: true } },
      },
    },
    {
      name: "end_datetime",
      type: "string",
      required: false,
      display_name: t("END_DATETIME_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("END_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { update_time: { $eq: true } },
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
        show: { update_time: { $eq: true } },
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(args.credentials, args.parameters.credential_id)
    const {
      calendar_id,
      event_id,
      summary,
      description,
      location,
      start_datetime,
      end_datetime,
      timezone,
    } = args.parameters

    const tz = (timezone as string) || "UTC"

    const body: Record<string, unknown> = {}
    if (summary !== undefined) body.summary = summary
    if (description !== undefined) body.description = description
    if (location !== undefined) body.location = location
    if (start_datetime !== undefined)
      body.start = { dateTime: start_datetime, timeZone: tz }
    if (end_datetime !== undefined)
      body.end = { dateTime: end_datetime, timeZone: tz }

    const res = await calendar.events.patch({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      requestBody: body,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
