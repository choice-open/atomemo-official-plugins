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
      min_length: 1,
      display_name: t("CALENDAR_SUMMARY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "Title of the calendar.",
          zh_Hans: "日历标题。",
        },
      },
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
      ai: {
        llm_description: {
          en_US: "Description of the calendar.",
          zh_Hans: "日历描述。",
        },
      },
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
      ai: {
        llm_description: {
          en_US: "Geographic location of the calendar as free-form text.",
          zh_Hans: "日历的地理位置，自由格式文本。",
        },
      },
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
      ai: {
        llm_description: {
          en_US:
            'IANA Time Zone Database name for the calendar, e.g. "America/Los_Angeles", "Asia/Shanghai".',
          zh_Hans:
            'IANA 时区名称，例如 "Asia/Shanghai"、"America/Los_Angeles"。',
        },
      },
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
