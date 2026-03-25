import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import { parseRequiredTimeRange } from "../../lib/validators"

export const queryFreebusyTool: ToolDefinition = {
  name: "query-freebusy",
  display_name: t("FREEBUSY_QUERY_DISPLAY_NAME"),
  description: t("FREEBUSY_QUERY_DESCRIPTION"),
  icon: "📊",
  parameters: [
    calendarCredentialParam,
    {
      name: "time_min",
      type: "string",
      required: true,
      display_name: t("TIME_MIN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Start of the time range to query. RFC3339 timestamp with timezone offset, e.g. 2025-03-18T00:00:00Z.",
          zh_Hans:
            "查询时间范围的起始。RFC3339 时间戳（含时区偏移），例如 2025-03-18T00:00:00Z。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MIN_REQUIRED_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "time_max",
      type: "string",
      required: true,
      display_name: t("TIME_MAX_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "End of the time range to query. RFC3339 timestamp with timezone offset. Must be after time_min.",
          zh_Hans:
            "查询时间范围的结束。RFC3339 时间戳（含时区偏移）。必须晚于 time_min。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MAX_REQUIRED_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "calendar_ids",
      type: "string",
      required: true,
      min_length: 1,
      display_name: t("CALENDAR_IDS_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'Comma-separated calendar IDs to query. Use "primary" for the user\'s primary calendar, or calendar email addresses.',
          zh_Hans:
            '要查询的日历 ID，逗号分隔。使用 "primary" 表示用户主日历，或使用日历邮箱地址。',
        },
      },
      ui: {
        component: "input",
        hint: t("CALENDAR_IDS_HINT"),
        placeholder: t("CALENDAR_IDS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { time_min, time_max, calendar_ids } = args.parameters

    const { timeMin, timeMax } = parseRequiredTimeRange(time_min, time_max)

    const ids = (calendar_ids as string)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)

    const res = await client.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: ids.map((id) => ({ id })),
      },
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
