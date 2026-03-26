import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const calendarCredentialParam = {
  name: "credential_id",
  type: "credential_id" as const,
  required: true,
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "google-calendar-oauth2",
  ui: { component: "credential-select" as const },
} satisfies Property<"credential_id">

export const calendarIdParam: Property<"calendar_id"> = {
  name: "calendar_id",
  type: "string" as const,
  required: true,
  display_name: t("CALENDAR_ID_DISPLAY_NAME"),
  default: "primary",
  ai: {
    llm_description: {
      en_US:
        'Calendar identifier. Use the keyword "primary" to access the currently authenticated user\'s primary calendar. For other calendars, use the calendar ID which is typically an email address — either the owner\'s email (e.g. user@gmail.com) or the calendar-specific address (e.g. abcdef1234@group.calendar.google.com). Call calendarList.list (the "List Calendars" tool) to retrieve all available calendar IDs.',
      zh_Hans:
        '日历标识符。使用关键字 "primary" 访问当前登录用户的主日历。其他日历使用日历 ID，通常为邮箱地址格式——可以是所有者邮箱（如 user@gmail.com）或日历专属地址（如 abcdef1234@group.calendar.google.com）。调用「列出日历」工具可获取所有可用的日历 ID。',
    },
  },
  ui: {
    component: "input" as const,
    hint: t("CALENDAR_ID_HINT"),
    placeholder: t("CALENDAR_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
}

/** For calendars.delete and calendarList.insert: no default; do not suggest primary. */
export const calendarIdParamDeleteOrInsert: Property<"calendar_id"> = {
  name: "calendar_id",
  type: "string" as const,
  required: true,
  min_length: 1,
  display_name: t("CALENDAR_ID_DISPLAY_NAME"),
  ai: {
    llm_description: {
      en_US:
        "Calendar ID (e.g. abcdef1234@group.calendar.google.com). Use the List Calendars tool to discover IDs.",
      zh_Hans:
        "日历 ID（如 abcdef1234@group.calendar.google.com）。通过「列出日历」查找。",
    },
  },
  ui: {
    component: "input" as const,
    hint: t("CALENDAR_ID_DELETE_INSERT_HINT"),
    placeholder: t("CALENDAR_ID_DELETE_INSERT_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
}

export const secondaryCalendarIdParam: Property = {
  name: "calendar_id",
  type: "string" as const,
  required: true,
  min_length: 1,
  display_name: t("CALENDAR_ID_DISPLAY_NAME"),
  ai: {
    llm_description: {
      en_US:
        'Secondary calendar identifier. Must be a calendar email address (e.g. abcdef1234@group.calendar.google.com). Do NOT use "primary" — this operation cannot target the primary calendar. Call "List Calendars" to find available IDs.',
      zh_Hans:
        '次要日历标识符。必须为日历邮箱地址（如 abcdef1234@group.calendar.google.com）。不能使用 "primary"——此操作不能用于主日历。调用「列出日历」获取可用 ID。',
    },
  },
  ui: {
    component: "input" as const,
    hint: t("SECONDARY_CALENDAR_ID_HINT"),
    placeholder: t("SECONDARY_CALENDAR_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
}

export const eventIdParam: Property = {
  name: "event_id",
  type: "string" as const,
  required: true,
  display_name: t("EVENT_ID_DISPLAY_NAME"),
  min_length: 5,
  max_length: 1024,
  ai: {
    llm_description: {
      en_US:
        "Opaque event identifier. Must be 5-1024 characters, using base32hex characters (lowercase a-v and digits 0-9).",
      zh_Hans:
        "事件标识符。必须为 5-1024 个字符，使用 base32hex 字符（小写字母 a-v 和数字 0-9）。",
    },
  },
  ui: {
    component: "input" as const,
    hint: t("EVENT_ID_HINT"),
    support_expression: true,
    width: "full",
  },
}

export const sendUpdatesParam: Property = {
  name: "send_updates",
  type: "string" as const,
  required: false,
  display_name: t("SEND_UPDATES_DISPLAY_NAME"),
  enum: ["none", "all", "externalOnly"],
  default: "none",
  ai: {
    llm_description: {
      en_US:
        'Whether to send notifications. "all" = all guests, "externalOnly" = non-Google Calendar guests only, "none" = no notifications.',
      zh_Hans:
        '是否发送通知。"all" = 所有参与者，"externalOnly" = 仅非 Google 日历参与者，"none" = 不通知。',
    },
  },
  ui: {
    component: "select" as const,
    support_expression: true,
    hint: t("SEND_UPDATES_HINT"),
    options: [
      { label: t("SEND_UPDATES_NONE"), value: "none" },
      { label: t("SEND_UPDATES_ALL"), value: "all" },
      { label: t("SEND_UPDATES_EXTERNAL_ONLY"), value: "externalOnly" },
    ],
  },
}

export const updateEventParams: Property[] = [
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
      support_expression: true,
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
          "Exclusive end in RFC3339; must be after start. Examples: 2025-03-18T10:00:00+08:00, 2025-03-18T02:00:00Z.",
        zh_Hans:
          "RFC3339 结束时间（不含），须晚于开始。示例：2025-03-18T10:00:00+08:00、2025-03-18T02:00:00Z。",
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
          "All-day start date (yyyy-mm-dd). Examples: 2025-03-18, 2025-12-01.",
        zh_Hans:
          "全天事件开始日期（yyyy-mm-dd）。示例：2025-03-18、2025-12-01。",
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
          "Exclusive end date (yyyy-mm-dd); for one-day event use the day after start_date. Examples: range Mar 18 only → end 2025-03-19.",
        zh_Hans:
          "全天结束日期（不含）；单日事件填开始日的下一天。示例：仅 3/18 一天 → 结束 2025-03-19。",
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
          'IANA Time Zone Database name for timed events. Examples: "Asia/Shanghai", "America/New_York", "Europe/Berlin", "Etc/UTC".',
        zh_Hans:
          'IANA 时区名称（用于非全天事件的开始/结束）。示例："Asia/Shanghai"、"America/New_York"、"Europe/Berlin"、"Etc/UTC"。',
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
      support_expression: true,
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
      support_expression: true,
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
      support_expression: true,
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
      support_expression: true,
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
      support_expression: true,
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
      support_expression: true,
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
  {
    name: "guests_can_invite_others",
    type: "boolean",
    required: false,
    display_name: t("GUESTS_CAN_INVITE_OTHERS_DISPLAY_NAME"),
    default: true,
    ai: {
      llm_description: {
        en_US: "Whether attendees other than the organizer can invite others.",
        zh_Hans: "是否允许非组织者的参与者邀请他人。",
      },
    },
    ui: {
      component: "switch",
      hint: t("GUESTS_CAN_INVITE_OTHERS_HINT"),
      support_expression: true,
    },
    display: {
      show: { use_advanced_options: { $eq: true } },
    },
  },
  {
    name: "guests_can_modify",
    type: "boolean",
    required: false,
    display_name: t("GUESTS_CAN_MODIFY_DISPLAY_NAME"),
    default: false,
    ai: {
      llm_description: {
        en_US:
          "Whether attendees other than the organizer can modify the event.",
        zh_Hans: "是否允许非组织者的参与者修改事件。",
      },
    },
    ui: {
      component: "switch",
      hint: t("GUESTS_CAN_MODIFY_HINT"),
      support_expression: true,
    },
    display: {
      show: { use_advanced_options: { $eq: true } },
    },
  },
  {
    name: "guests_can_see_other_guests",
    type: "boolean",
    required: false,
    display_name: t("GUESTS_CAN_SEE_OTHER_GUESTS_DISPLAY_NAME"),
    default: true,
    ai: {
      llm_description: {
        en_US: "Whether attendees can see other guests on the event.",
        zh_Hans: "参与者是否可见其他参与者。",
      },
    },
    ui: {
      component: "switch",
      hint: t("GUESTS_CAN_SEE_OTHER_GUESTS_HINT"),
      support_expression: true,
    },
    display: {
      show: { use_advanced_options: { $eq: true } },
    },
  },
  {
    name: "max_attendees",
    type: "integer",
    required: false,
    display_name: t("MAX_ATTENDEES_DISPLAY_NAME"),
    minimum: 1,
    ai: {
      llm_description: {
        en_US:
          "Max attendees to include in the API response for create/update. Omit for no cap.",
        zh_Hans: "创建/更新时 API 响应中包含的最大参与者数。不填表示不限制。",
      },
    },
    ui: {
      component: "number-input",
      hint: t("MAX_ATTENDEES_HINT"),
      support_expression: true,
    },
    display: {
      show: { use_advanced_options: { $eq: true } },
    },
  },
]
