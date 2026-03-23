import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const createCalendarTool: ToolDefinition = {
  name: "create-calendar",
  display_name: t("CREATE_CALENDAR_DISPLAY_NAME"),
  description: t("CREATE_CALENDAR_DESCRIPTION"),
  icon: "➕",
  parameters: [
    calendarCredentialParam,
    {
      name: "summary",
      type: "string",
      required: true,
      display_name: t("CALENDAR_SUMMARY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CALENDAR_SUMMARY_HINT"),
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
        component: "input",
        hint: t("CALENDAR_DESCRIPTION_HINT"),
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
        hint: t("CALENDAR_LOCATION_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "timeZone",
      type: "string",
      required: false,
      display_name: t("TIMEZONE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CALENDAR_TIMEZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const calendarClient = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )

    const { summary, description, location, timeZone } = args.parameters

    const res = await calendarClient.calendars.insert({
      requestBody: {
        summary: summary as string,
        description: (description as string) || undefined,
        location: (location as string) || undefined,
        timeZone: (timeZone as string) || undefined,
      },
    })
    return sanitizeObject(res.data)
  },
}
