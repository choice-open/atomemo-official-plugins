import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const insertCalendarListTool: ToolDefinition = {
  name: "insert-calendar-list",
  display_name: t("INSERT_CALENDAR_LIST_DISPLAY_NAME"),
  description: t("INSERT_CALENDAR_LIST_DESCRIPTION"),
  icon: "➕",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    {
      name: "selected",
      type: "boolean",
      required: false,
      display_name: t("SELECTED_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("SELECTED_HINT"),
      },
    },
    {
      name: "colorId",
      type: "string",
      required: false,
      display_name: t("COLOR_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("COLOR_ID_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(args.credentials, args.parameters.credential_id)
    const { calendar_id, selected, colorId } = args.parameters

    const requestBody: Record<string, unknown> = {}
    if (selected != null) requestBody.selected = selected
    if (colorId != null && colorId !== "") requestBody.colorId = colorId

    const res = await client.calendarList.insert({
      requestBody: {
        id: calendar_id as string,
        ...requestBody,
      },
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
