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
        'Calendar identifier. Use "primary" for the authenticated user\'s primary calendar, or a calendar email address (e.g. user@group.calendar.google.com).',
      zh_Hans:
        '日历标识符。使用 "primary" 表示当前用户的主日历，或使用日历邮箱地址（如 user@group.calendar.google.com）。',
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
