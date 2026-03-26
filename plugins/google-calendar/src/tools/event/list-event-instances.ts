import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import { parseTimeRange } from "../../lib/validators"

export const listEventInstancesTool: ToolDefinition = {
  name: "list-event-instances",
  display_name: t("LIST_EVENT_INSTANCES_DISPLAY_NAME"),
  description: t("LIST_EVENT_INSTANCES_DESCRIPTION"),
  icon: "🔁",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    eventIdParam,
    {
      name: "use_time_range",
      type: "boolean",
      required: false,
      display_name: t("USE_TIME_RANGE_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        support_expression: true,
        hint: t("USE_TIME_RANGE_HINT"),
      },
    },
    {
      name: "time_min",
      type: "string",
      required: false,
      display_name: t("TIME_MIN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeMin: lower bound (exclusive) for event end time (RFC3339). Examples: 2025-03-01T00:00:00Z, 2025-03-01T08:00:00+08:00.",
          zh_Hans:
            "timeMin：事件结束时间的下限（不含），RFC3339。示例：2025-03-01T00:00:00Z、2025-03-01T08:00:00+08:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MIN_HINT"),
        support_expression: true,
      },
      display: {
        show: { use_time_range: { $eq: true } },
      },
    },
    {
      name: "time_max",
      type: "string",
      required: false,
      display_name: t("TIME_MAX_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeMax: upper bound (exclusive) for event start time (RFC3339). Must be > timeMin. Examples: 2025-03-31T23:59:59Z, 2025-04-01T00:00:00+08:00.",
          zh_Hans:
            "timeMax：事件开始时间的上限（不含），RFC3339。须大于 timeMin。示例：2025-03-31T23:59:59Z、2025-04-01T00:00:00+08:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MAX_HINT"),
        support_expression: true,
      },
      display: {
        show: { use_time_range: { $eq: true } },
      },
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      display_name: t("MAX_RESULTS_DISPLAY_NAME"),
      default: 250,
      minimum: 1,
      maximum: 2500,
      ai: {
        llm_description: {
          en_US:
            "Maximum number of instances returned per page. Default 250, max 2500.",
          zh_Hans: "每页返回的最大实例数。默认 250，最大 2500。",
        },
      },
      ui: {
        component: "number-input",
        hint: t("MAX_RESULTS_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id, time_min, time_max, max_results } =
      args.parameters

    const { timeMin, timeMax } = parseTimeRange(time_min, time_max)

    const res = await client.events.instances({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      timeMin,
      timeMax,
      maxResults: max_results ?? 250,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
