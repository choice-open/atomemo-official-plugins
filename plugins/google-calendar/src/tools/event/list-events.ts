import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const listEventsTool: ToolDefinition = {
  name: "list-events",
  display_name: t("LIST_EVENTS_DISPLAY_NAME"),
  description: t("LIST_EVENTS_DESCRIPTION"),
  icon: "📋",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    {
      name: "q",
      type: "string",
      required: false,
      display_name: t("SEARCH_QUERY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Free text search terms. Matches against summary, description, location, attendee displayName/email, and organizer displayName/email.",
          zh_Hans:
            "自由文本搜索。匹配标题、描述、地点、参与者姓名/邮箱、组织者姓名/邮箱。",
        },
      },
      ui: {
        component: "input",
        hint: t("SEARCH_QUERY_HINT"),
        placeholder: t("SEARCH_QUERY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "use_time_range",
      type: "boolean",
      required: false,
      display_name: t("USE_TIME_RANGE_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
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
            "Lower bound (exclusive) for event end time. RFC3339 timestamp with mandatory timezone offset, e.g. 2025-03-18T00:00:00Z. If timeMax is set, timeMin must be smaller.",
          zh_Hans:
            "事件结束时间的下限（不含）。RFC3339 时间戳，必须包含时区偏移。若设置了 timeMax，timeMin 必须更小。",
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
            "Upper bound (exclusive) for event start time. RFC3339 timestamp with mandatory timezone offset. Must be greater than timeMin.",
          zh_Hans:
            "事件开始时间的上限（不含）。RFC3339 时间戳，必须包含时区偏移。必须大于 timeMin。",
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
            "Maximum number of events per page. Default 250, max 2500. Use nextPageToken for pagination.",
          zh_Hans: "每页最大事件数。默认 250，最大 2500。使用 nextPageToken 分页。",
        },
      },
      ui: {
        component: "number-input",
        support_expression: true,
        hint: t("MAX_RESULTS_HINT"),
      },
    },
    {
      name: "single_events",
      type: "boolean",
      required: false,
      display_name: t("SINGLE_EVENTS_DISPLAY_NAME"),
      default: true,
      ai: {
        llm_description: {
          en_US:
            "If true, expand recurring events into instances and return only single one-off events and instances. Required for orderBy=startTime. Default: true.",
          zh_Hans:
            "为 true 时将重复事件展开为实例。按开始时间排序时必须为 true。默认：true。",
        },
      },
      ui: {
        component: "switch",
        hint: t("SINGLE_EVENTS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "order_by",
      type: "string",
      required: false,
      display_name: t("ORDER_BY_DISPLAY_NAME"),
      enum: ["startTime", "updated"],
      default: "startTime",
      ai: {
        llm_description: {
          en_US:
            'Result ordering. "startTime" (ascending, requires singleEvents=true) or "updated" (ascending, last modification time).',
          zh_Hans:
            '结果排序。"startTime"（升序，需要 singleEvents=true）或 "updated"（升序，按最后修改时间）。',
        },
      },
      ui: {
        component: "select",
        hint: t("ORDER_BY_HINT"),
        options: [
          { label: t("ORDER_BY_START_TIME"), value: "startTime" },
          { label: t("ORDER_BY_UPDATED"), value: "updated" },
        ],
        support_expression: true,
      },
    },
    {
      name: "show_deleted",
      type: "boolean",
      required: false,
      display_name: t("SHOW_DELETED_DISPLAY_NAME"),
      default: false,
      ai: {
        llm_description: {
          en_US:
            'Whether to include deleted events (status "cancelled") in the result. Default: false.',
          zh_Hans:
            '是否在结果中包含已删除事件（状态为 "cancelled"）。默认：false。',
        },
      },
      ui: {
        component: "switch",
        hint: t("SHOW_DELETED_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const {
      calendar_id,
      q,
      time_min,
      time_max,
      max_results,
      single_events,
      order_by,
      show_deleted,
    } = args.parameters

    const singleEvents = single_events !== false
    const orderByValue =
      singleEvents && (order_by as string) !== "updated"
        ? "startTime"
        : (order_by as string) || undefined

    const res = await calendar.events.list({
      calendarId: calendar_id as string,
      q: (q as string) || undefined,
      timeMin: time_min || undefined,
      timeMax: time_max || undefined,
      maxResults: max_results ?? 250,
      singleEvents,
      orderBy: orderByValue,
      showDeleted: show_deleted === true ? true : undefined,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
