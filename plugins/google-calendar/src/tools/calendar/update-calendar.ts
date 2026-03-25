import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, secondaryCalendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const updateCalendarTool: ToolDefinition = {
  name: "update-calendar",
  display_name: t("UPDATE_CALENDAR_DISPLAY_NAME"),
  description: t("UPDATE_CALENDAR_DESCRIPTION"),
  icon: "✏️",
  parameters: [
    calendarCredentialParam,
    secondaryCalendarIdParam,
    {
      name: "summary",
      type: "string",
      required: false,
      display_name: t("SUMMARY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "New title of the calendar. Leave empty to keep unchanged.",
          zh_Hans: "新的日历标题。留空则不修改。",
        },
      },
      ui: {
        component: "input",
        hint: t("CALENDAR_SUMMARY_HINT"),
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
          en_US: "New description of the calendar.",
          zh_Hans: "新的日历描述。",
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
          en_US: "New geographic location as free-form text.",
          zh_Hans: "新的地理位置，自由格式文本。",
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
            'New IANA timezone for the calendar, e.g. "Asia/Shanghai", "America/Los_Angeles".',
          zh_Hans:
            '新的 IANA 时区，例如 "Asia/Shanghai"、"America/Los_Angeles"。',
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
    const { parameters, credentials } = args
    const client = requireCalendarClient(credentials, parameters.credential_id)

    const { calendar_id, description, location, summary, timeZone } = parameters

    const requestBody: Record<string, string | undefined> = {}
    if (summary != null && summary !== "")
      requestBody.summary = summary as string
    if (description != null && description !== "")
      requestBody.description = description as string
    if (location != null && location !== "")
      requestBody.location = location as string
    if (timeZone != null && timeZone !== "")
      requestBody.timeZone = timeZone as string

    if (Object.keys(requestBody).length === 0) {
      throw new Error(
        "At least one field (summary, description, location, timeZone) must be provided",
      )
    }

    const res = await client.calendars.patch({
      calendarId: calendar_id as string,
      requestBody: requestBody as {
        summary?: string
        description?: string
        location?: string
        timeZone?: string
      },
    })

    return sanitizeObject(res.data)
  },
}
