import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const clearCalendarTool: ToolDefinition = {
  name: "clear-calendar",
  display_name: t("CLEAR_CALENDAR_DISPLAY_NAME"),
  description: t("CLEAR_CALENDAR_DESCRIPTION"),
  icon: "⚠️",
  parameters: [
    calendarCredentialParam,
    {
      name: "calendar_id",
      type: "string",
      required: true,
      display_name: t("CALENDAR_ID_DISPLAY_NAME"),
      constant: "primary",
      default: "primary",
      ai: {
        llm_description: {
          en_US:
            'Only "primary" is allowed. This dangerous operation clears ALL events from the primary calendar and CANNOT be undone.',
          zh_Hans:
            '仅允许 "primary"。此危险操作将永久删除主日历中的所有事件，且不可撤销。',
        },
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            '⚠️ Only works on primary calendar. This will permanently delete ALL events!',
          zh_Hans: "⚠️ 仅适用于主日历。将永久删除所有事件！",
        },
        readonly: true,
        width: "full",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const client = requireCalendarClient(credentials, parameters.credential_id)

    const res = await client.calendars.clear({
      calendarId: "primary",
    })

    return sanitizeObject(res.data)
  },
}
