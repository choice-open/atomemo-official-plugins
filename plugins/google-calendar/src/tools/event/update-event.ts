import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
  sendUpdatesParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import {
  optionalIanaTimezoneSchema,
  optionalRfc3339Schema,
} from "../../lib/validators"

export const updateEventTool: ToolDefinition = {
  name: "update-event",
  display_name: t("UPDATE_EVENT_DISPLAY_NAME"),
  description: t("UPDATE_EVENT_DESCRIPTION"),
  icon: "✏️",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    eventIdParam,
    {
      name: "update_time",
      type: "boolean",
      required: false,
      display_name: t("UPDATE_TIME_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("UPDATE_TIME_HINT"),
        support_expression: true,
      },
    },
    {
      name: "include_details",
      type: "boolean",
      required: false,
      display_name: t("INCLUDE_DETAILS_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("INCLUDE_DETAILS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "summary",
      type: "string",
      required: false,
      display_name: t("SUMMARY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "New title of the event. Leave empty to keep unchanged.",
          zh_Hans: "新的事件标题。留空则不修改。",
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
      name: "description",
      type: "string",
      required: false,
      display_name: t("DESCRIPTION_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "New description of the event. Can contain HTML.",
          zh_Hans: "新的事件描述。支持 HTML 格式。",
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
          en_US: "New geographic location as free-form text.",
          zh_Hans: "新的地理位置，自由格式文本。",
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
      name: "start_datetime",
      type: "string",
      required: false,
      display_name: t("START_DATETIME_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "New start time in RFC3339 format with timezone offset, e.g. 2025-03-18T09:00:00+08:00.",
          zh_Hans:
            "RFC3339 格式的新开始时间（含时区偏移），例如 2025-03-18T09:00:00+08:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("START_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { update_time: { $eq: true } },
      },
    },
    {
      name: "end_datetime",
      type: "string",
      required: false,
      display_name: t("END_DATETIME_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "New exclusive end time in RFC3339 format with timezone offset. Must be after start time.",
          zh_Hans:
            "RFC3339 格式的新结束时间（不含，含时区偏移）。必须晚于开始时间。",
        },
      },
      ui: {
        component: "input",
        hint: t("END_DATETIME_HINT"),
        support_expression: true,
      },
      display: {
        show: { update_time: { $eq: true } },
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
            'IANA Time Zone Database name, e.g. "Asia/Shanghai", "America/Los_Angeles".',
          zh_Hans:
            'IANA 时区名称，例如 "Asia/Shanghai"、"America/Los_Angeles"。',
        },
      },
      ui: {
        component: "input",
        hint: t("TIMEZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        show: { update_time: { $eq: true } },
      },
    },
    sendUpdatesParam,
    {
      name: "use_advanced_options",
      type: "boolean",
      required: false,
      display_name: t("USE_ADVANCED_OPTIONS_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("USE_ADVANCED_OPTIONS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "visibility",
      type: "string",
      required: false,
      display_name: t("VISIBILITY_DISPLAY_NAME"),
      enum: ["default", "public", "private", "confidential"],
      ai: {
        llm_description: {
          en_US:
            'Event visibility. "default" = calendar default, "public" = visible to all, "private" = only attendees, "confidential" = same as private.',
          zh_Hans:
            '事件可见性。"default" = 日历默认, "public" = 对所有人可见, "private" = 仅参与者可见, "confidential" = 同 private。',
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
        support_expression: true,
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
      ai: {
        llm_description: {
          en_US:
            '"opaque" = busy (default), "transparent" = available/free.',
          zh_Hans: '"opaque" = 忙碌（默认），"transparent" = 有空。',
        },
      },
      ui: {
        component: "select",
        hint: t("TRANSPARENCY_HINT"),
        options: [
          { label: t("TRANSPARENCY_OPAQUE"), value: "opaque" },
          { label: t("TRANSPARENCY_TRANSPARENT"), value: "transparent" },
        ],
        support_expression: true,
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
      ai: {
        llm_description: {
          en_US: '"confirmed" = default, "tentative" = tentatively confirmed.',
          zh_Hans: '"confirmed" = 已确认（默认），"tentative" = 暂定。',
        },
      },
      ui: {
        component: "select",
        hint: t("EVENT_STATUS_HINT"),
        options: [
          { label: t("EVENT_STATUS_CONFIRMED"), value: "confirmed" },
          { label: t("EVENT_STATUS_TENTATIVE"), value: "tentative" },
        ],
        support_expression: true,
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
          en_US: "Event color ID (1-11) from the colors endpoint.",
          zh_Hans: "事件颜色 ID（1-11），来自颜色端点。",
        },
      },
      ui: {
        component: "select",
        support_expression: true,
        hint: t("EVENT_COLOR_ID_HINT"),
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
    const {
      calendar_id,
      event_id,
      summary,
      description,
      location,
      start_datetime,
      end_datetime,
      timezone,
      send_updates,
      visibility,
      transparency,
      status,
      color_id,
    } = args.parameters

    const tz = optionalIanaTimezoneSchema.parse(timezone) ?? "UTC"
    const sdt = optionalRfc3339Schema.parse(start_datetime)
    const edt = optionalRfc3339Schema.parse(end_datetime)

    if (sdt && edt && new Date(sdt) >= new Date(edt)) {
      throw new Error("end_datetime must be after start_datetime")
    }

    const body: Record<string, unknown> = {}
    if (summary !== undefined) body.summary = summary
    if (description !== undefined) body.description = description
    if (location !== undefined) body.location = location
    if (sdt) body.start = { dateTime: sdt, timeZone: tz }
    if (edt) body.end = { dateTime: edt, timeZone: tz }
    if (visibility !== undefined) body.visibility = visibility
    if (transparency !== undefined) body.transparency = transparency
    if (status !== undefined) body.status = status
    if (color_id !== undefined) body.colorId = color_id

    const res = await calendar.events.patch({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      sendUpdates: (send_updates as string) || undefined,
      requestBody: body,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
