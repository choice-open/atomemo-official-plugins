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
