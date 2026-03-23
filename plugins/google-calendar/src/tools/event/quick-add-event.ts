import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const quickAddEventTool: ToolDefinition = {
  name: "quick-add-event",
  display_name: t("QUICK_ADD_EVENT_DISPLAY_NAME"),
  description: t("QUICK_ADD_EVENT_DESCRIPTION"),
  icon: "⚡",
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
      name: "text",
      type: "string",
      required: true,
      display_name: t("QUICK_ADD_TEXT_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("QUICK_ADD_TEXT_HINT"),
        placeholder: t("QUICK_ADD_TEXT_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(args.credentials, args.parameters.credential_id)
    const { calendar_id, text } = args.parameters

    const res = await client.events.quickAdd({
      calendarId: calendar_id as string,
      text: text as string,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
