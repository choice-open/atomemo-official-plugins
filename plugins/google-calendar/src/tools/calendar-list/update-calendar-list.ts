import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, secondaryCalendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const updateCalendarListTool: ToolDefinition = {
  name: "update-calendar-list",
  display_name: t("UPDATE_CALENDAR_LIST_DISPLAY_NAME"),
  description: t("UPDATE_CALENDAR_LIST_DESCRIPTION"),
  icon: "✏️",
  parameters: [
    calendarCredentialParam,
    secondaryCalendarIdParam,
    {
      name: "summaryOverride",
      type: "string",
      required: false,
      display_name: t("SUMMARY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CALENDAR_SUMMARY_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "colorId",
      type: "string",
      required: false,
      display_name: t("COLOR_ID_DISPLAY_NAME"),
      enum: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24",
      ],
      ai: {
        llm_description: {
          en_US:
            "Calendar color ID (1-24) referencing the calendar section of the colors definition. Use 'Get Colors' to see available options.",
          zh_Hans:
            "日历颜色 ID（1-24），引用颜色定义中的日历部分。使用「获取颜色」工具查看可用选项。",
        },
      },
      ui: {
        component: "select",
        support_expression: true,
        hint: t("COLOR_ID_HINT"),
      },
    },
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
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, summaryOverride, colorId, selected } = args.parameters

    const requestBody: Record<string, unknown> = {}
    if (summaryOverride != null && summaryOverride !== "")
      requestBody.summaryOverride = summaryOverride
    if (colorId != null && colorId !== "") requestBody.colorId = colorId
    if (selected != null) requestBody.selected = selected

    if (Object.keys(requestBody).length === 0) {
      throw new Error(
        "At least one field (summaryOverride, colorId, selected) must be provided",
      )
    }

    const res = await client.calendarList.patch({
      calendarId: calendar_id as string,
      requestBody,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
