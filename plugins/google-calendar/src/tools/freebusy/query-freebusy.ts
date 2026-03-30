import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { calendar_v3 } from "googleapis"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import {
  optionalIanaTimezoneSchema,
  parseRequiredTimeRange,
} from "../../lib/validators"

function parseOptionalBoundedInt(
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value)) return undefined
  if (value < min || value > max) return undefined
  return value
}

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
            "timeMin: start of the query interval (RFC3339 with offset). Examples: 2025-03-18T00:00:00Z, 2025-03-18T08:00:00+08:00.",
          zh_Hans:
            "timeMin：查询间隔起始（RFC3339，须含时区偏移）。示例：2025-03-18T00:00:00Z、2025-03-18T08:00:00+08:00。",
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
            "timeMax: end of the query interval (RFC3339). Must be after timeMin. Examples: 2025-03-23T23:59:59Z, 2025-03-24T00:00:00+08:00.",
          zh_Hans:
            "timeMax：查询间隔结束（RFC3339），须晚于 timeMin。示例：2025-03-23T23:59:59Z、2025-03-24T00:00:00+08:00。",
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
      name: "items",
      type: "string",
      required: true,
      min_length: 1,
      display_name: t("FREEBUSY_ITEMS_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'items: comma-separated calendar or group ids (maps to request body items[].id). Use "primary" or email-style calendar ids.',
          zh_Hans:
            'items：逗号分隔的日历或群组标识（对应请求体 items[].id）。可使用 "primary" 或邮箱形式日历 ID。',
        },
      },
      ui: {
        component: "input",
        hint: t("FREEBUSY_ITEMS_HINT"),
        placeholder: t("FREEBUSY_ITEMS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "time_zone",
      type: "string",
      required: false,
      display_name: t("FREEBUSY_TIME_ZONE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeZone: IANA id for the response. Optional; API default UTC. Examples: Asia/Shanghai, Europe/Berlin, Etc/UTC.",
          zh_Hans:
            "timeZone：响应使用的 IANA 时区。可选，API 默认 UTC。示例：Asia/Shanghai、Europe/Berlin、Etc/UTC。",
        },
      },
      ui: {
        component: "input",
        hint: t("FREEBUSY_TIME_ZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "group_expansion_max",
      type: "integer",
      required: false,
      display_name: t("FREEBUSY_GROUP_EXPANSION_MAX_DISPLAY_NAME"),
      minimum: 1,
      maximum: 100,
      ai: {
        llm_description: {
          en_US:
            "groupExpansionMax: max calendar identifiers expanded for a single group (optional, max 100).",
          zh_Hans:
            "groupExpansionMax：单个群组最多展开的日历标识数量（可选，最大 100）。",
        },
      },
      ui: {
        component: "number-input",
        hint: t("FREEBUSY_GROUP_EXPANSION_MAX_HINT"),
        support_expression: true,
      },
    },
    {
      name: "calendar_expansion_max",
      type: "integer",
      required: false,
      display_name: t("FREEBUSY_CALENDAR_EXPANSION_MAX_DISPLAY_NAME"),
      minimum: 1,
      maximum: 50,
      ai: {
        llm_description: {
          en_US:
            "calendarExpansionMax: max calendars for which FreeBusy is returned (optional, max 50).",
          zh_Hans:
            "calendarExpansionMax：返回忙闲信息的日历数量上限（可选，最大 50）。",
        },
      },
      ui: {
        component: "number-input",
        hint: t("FREEBUSY_CALENDAR_EXPANSION_MAX_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const {
      time_min,
      time_max,
      items,
      time_zone,
      group_expansion_max,
      calendar_expansion_max,
    } = args.parameters

    const { timeMin, timeMax } = parseRequiredTimeRange(time_min, time_max)

    const ids = (items as string)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)

    if (ids.length === 0) {
      throw new Error("items must contain at least one calendar or group id")
    }

    const tzParsed = optionalIanaTimezoneSchema.parse(time_zone)
    const groupExpansionMax = parseOptionalBoundedInt(
      group_expansion_max,
      1,
      100,
    )
    const calendarExpansionMax = parseOptionalBoundedInt(
      calendar_expansion_max,
      1,
      50,
    )

    const requestBody: calendar_v3.Schema$FreeBusyRequest = {
      timeMin,
      timeMax,
      ...(tzParsed ? { timeZone: tzParsed } : {}),
      ...(groupExpansionMax !== undefined ? { groupExpansionMax } : {}),
      ...(calendarExpansionMax !== undefined ? { calendarExpansionMax } : {}),
      items: ids.map((id) => ({ id })),
    }

    const res = await client.freebusy.query({ requestBody })
    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
