import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  sendUpdatesParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const createEventTool: ToolDefinition = {
  name: "create-event",
  display_name: t("CREATE_EVENT_DISPLAY_NAME"),
  description: t("CREATE_EVENT_DESCRIPTION"),
  icon: "➕",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    {
      name: "summary",
      type: "string",
      required: true,
      display_name: t("SUMMARY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "Title of the event.",
          zh_Hans: "事件标题。",
        },
      },
      ui: {
        component: "input",
        hint: t("SUMMARY_HINT"),
        placeholder: t("SUMMARY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "is_all_day_event",
      type: "boolean",
      required: false,
      display_name: t("IS_ALL_DAY_EVENT_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("IS_ALL_DAY_EVENT_HINT"),
      },
    },
    {
      name: "start_datetime",
      type: "string",
      required: true,
      display_name: t("START_DATETIME_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Start time in RFC3339 format. A timezone offset is required unless timezone is specified, e.g. 2025-03-18T09:00:00+08:00 or 2025-03-18T01:00:00Z.",
          zh_Hans:
            "RFC3339 格式的开始时间。除非指定了时区，否则必须包含时区偏移，例如 2025-03-18T09:00:00+08:00 或 2025-03-18T01:00:00Z。",
        },
      },
      ui: {
        component: "input",
        hint: t("START_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: false } },
      },
    },
    {
      name: "end_datetime",
      type: "string",
      required: true,
      display_name: t("END_DATETIME_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Exclusive end time in RFC3339 format. Must be after start time. A timezone offset is required unless timezone is specified.",
          zh_Hans:
            "RFC3339 格式的结束时间（不含）。必须晚于开始时间。除非指定了时区，否则必须包含时区偏移。",
        },
      },
      ui: {
        component: "input",
        hint: t("END_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: false } },
      },
    },
    {
      name: "start_date",
      type: "string",
      required: true,
      display_name: t("START_DATE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'Start date for all-day events in "yyyy-mm-dd" format, e.g. 2025-03-18.',
          zh_Hans:
            '全天事件的开始日期，格式为 "yyyy-mm-dd"，例如 2025-03-18。',
        },
      },
      ui: {
        component: "input",
        hint: t("START_DATE_HINT"),
        placeholder: t("START_DATE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: true } },
      },
    },
    {
      name: "end_date",
      type: "string",
      required: true,
      display_name: t("END_DATE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'Exclusive end date for all-day events in "yyyy-mm-dd" format. For a single-day event, set to the day after start_date.',
          zh_Hans:
            '全天事件的结束日期（不含），格式为 "yyyy-mm-dd"。单日事件应设为 start_date 的下一天。',
        },
      },
      ui: {
        component: "input",
        hint: t("END_DATE_HINT"),
        placeholder: t("END_DATE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: true } },
      },
    },
    {
      name: "timezone",
      type: "string",
      required: false,
      display_name: t("TIMEZONE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'IANA Time Zone Database name, e.g. "America/Los_Angeles", "Asia/Shanghai", "Europe/Zurich". Used for start/end times.',
          zh_Hans:
            'IANA 时区数据库名称，例如 "Asia/Shanghai"、"America/Los_Angeles"。用于开始/结束时间。',
        },
      },
      ui: {
        component: "input",
        hint: t("TIMEZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { is_all_day_event: { $eq: false } },
      },
    },
    sendUpdatesParam,
    {
      name: "include_details",
      type: "boolean",
      required: false,
      display_name: t("INCLUDE_DETAILS_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("INCLUDE_DETAILS_HINT"),
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: t("DESCRIPTION_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "Description of the event. Can contain HTML.",
          zh_Hans: "事件描述。支持 HTML 格式。",
        },
      },
      ui: {
        component: "textarea",
        hint: t("DESCRIPTION_HINT"),
        support_expression: true,
        width: "full",
      },
      display: {
        show: { include_details: { $eq: true } },
      },
    },
    {
      name: "location",
      type: "string",
      required: false,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "Geographic location of the event as free-form text.",
          zh_Hans: "事件地理位置，自由格式文本。",
        },
      },
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { include_details: { $eq: true } },
      },
    },
    {
      name: "use_advanced_options",
      type: "boolean",
      required: false,
      display_name: t("USE_ADVANCED_OPTIONS_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("USE_ADVANCED_OPTIONS_HINT"),
      },
    },
    {
      name: "visibility",
      type: "string",
      required: false,
      display_name: t("VISIBILITY_DISPLAY_NAME"),
      enum: ["default", "public", "private", "confidential"],
      default: "default",
      ai: {
        llm_description: {
          en_US:
            'Event visibility. "default" = calendar default, "public" = visible to all, "private" = only attendees, "confidential" = same as private (compatibility).',
          zh_Hans:
            '事件可见性。"default" = 日历默认, "public" = 对所有人可见, "private" = 仅参与者可见, "confidential" = 同 private（兼容性）。',
        },
      },
      ui: {
        component: "select",
        hint: t("VISIBILITY_HINT"),
        options: [
          { label: t("VISIBILITY_DEFAULT"), value: "default" },
          { label: t("VISIBILITY_PUBLIC"), value: "public" },
          { label: t("VISIBILITY_PRIVATE"), value: "private" },
          { label: t("VISIBILITY_CONFIDENTIAL"), value: "confidential" },
        ],
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
    {
      name: "transparency",
      type: "string",
      required: false,
      display_name: t("TRANSPARENCY_DISPLAY_NAME"),
      enum: ["opaque", "transparent"],
      default: "opaque",
      ai: {
        llm_description: {
          en_US:
            'Whether the event blocks time on the calendar. "opaque" = busy (default), "transparent" = available.',
          zh_Hans:
            '事件是否在日历上占用时间。"opaque" = 忙碌（默认），"transparent" = 有空。',
        },
      },
      ui: {
        component: "select",
        hint: t("TRANSPARENCY_HINT"),
        options: [
          { label: t("TRANSPARENCY_OPAQUE"), value: "opaque" },
          { label: t("TRANSPARENCY_TRANSPARENT"), value: "transparent" },
        ],
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
    {
      name: "status",
      type: "string",
      required: false,
      display_name: t("EVENT_STATUS_DISPLAY_NAME"),
      enum: ["confirmed", "tentative"],
      default: "confirmed",
      ai: {
        llm_description: {
          en_US:
            'Status of the event. "confirmed" = default, "tentative" = tentatively confirmed.',
          zh_Hans: '事件状态。"confirmed" = 已确认（默认），"tentative" = 暂定。',
        },
      },
      ui: {
        component: "select",
        hint: t("EVENT_STATUS_HINT"),
        options: [
          { label: t("EVENT_STATUS_CONFIRMED"), value: "confirmed" },
          { label: t("EVENT_STATUS_TENTATIVE"), value: "tentative" },
        ],
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
    {
      name: "color_id",
      type: "string",
      required: false,
      display_name: t("EVENT_COLOR_ID_DISPLAY_NAME"),
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      ai: {
        llm_description: {
          en_US:
            "Event color ID (1-11) referencing the event colors definition. Use the 'Get Colors' tool to see available options.",
          zh_Hans:
            "事件颜色 ID（1-11），引用事件颜色定义。使用「获取颜色」工具查看可用选项。",
        },
      },
      ui: {
        component: "select",
        hint: t("EVENT_COLOR_ID_HINT"),
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
    {
      name: "recurrence",
      type: "string",
      required: false,
      display_name: t("RECURRENCE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Recurrence rule per RFC5545. Examples: RRULE:FREQ=DAILY;COUNT=5, RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR, RRULE:FREQ=MONTHLY;BYMONTHDAY=15.",
          zh_Hans:
            "RFC5545 重复规则。例如：RRULE:FREQ=DAILY;COUNT=5, RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR, RRULE:FREQ=MONTHLY;BYMONTHDAY=15。",
        },
      },
      ui: {
        component: "input",
        hint: t("RECURRENCE_HINT"),
        placeholder: t("RECURRENCE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
    {
      name: "attendees",
      type: "string",
      required: false,
      display_name: t("ATTENDEES_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Comma-separated email addresses of attendees. Each must be a valid email per RFC5322.",
          zh_Hans:
            "参与者邮箱地址，逗号分隔。每个地址必须符合 RFC5322 邮箱格式。",
        },
      },
      ui: {
        component: "input",
        hint: t("ATTENDEES_HINT"),
        placeholder: t("ATTENDEES_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
      display: {
        show: { use_advanced_options: { $eq: true } },
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const params = args.parameters
    const {
      calendar_id,
      summary,
      description,
      location,
      is_all_day_event,
      start_datetime,
      end_datetime,
      start_date,
      end_date,
      timezone,
      send_updates,
      visibility,
      transparency,
      status,
      color_id,
      recurrence,
      attendees,
    } = params

    const tz = (timezone as string) || "UTC"

    if (is_all_day_event) {
      if (!start_date || !end_date) {
        throw new Error(
          "Start date and end date are required for all-day events",
        )
      }
    } else {
      if (!start_datetime || !end_datetime) {
        throw new Error("Start time and end time are required for timed events")
      }
    }

    const requestBody: Record<string, unknown> = {
      summary: summary as string,
      description: (description as string) || undefined,
      location: (location as string) || undefined,
    }

    if (is_all_day_event) {
      requestBody.start = { date: start_date as string }
      requestBody.end = { date: end_date as string }
    } else {
      requestBody.start = { dateTime: start_datetime as string, timeZone: tz }
      requestBody.end = { dateTime: end_datetime as string, timeZone: tz }
    }

    if (visibility && visibility !== "default")
      requestBody.visibility = visibility
    if (transparency && transparency !== "opaque")
      requestBody.transparency = transparency
    if (status && status !== "confirmed") requestBody.status = status
    if (color_id) requestBody.colorId = color_id

    if (recurrence) {
      const rules = (recurrence as string)
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
      requestBody.recurrence = rules
    }

    if (attendees) {
      const emails = (attendees as string)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
      requestBody.attendees = emails.map((email) => ({ email }))
    }

    const res = await calendar.events.insert({
      calendarId: calendar_id as string,
      sendUpdates: (send_updates as string) || undefined,
      requestBody,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
