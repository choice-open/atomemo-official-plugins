import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim()
  return undefined
}

/** Format date in given timezone with pattern (yyyy, yy, MM, dd, HH, mm, ss, SSS). */
function formatDateByPattern(date: Date, pattern: string, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    fractionalSecondDigits: 3,
  })
  const parts = formatter.formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""

  const year = get("year")
  const month = get("month")
  const day = get("day")
  const hour = get("hour")
  const minute = get("minute")
  const second = get("second")
  const fraction = (get("fraction") ?? "000").slice(0, 3).padEnd(3, "0")

  return pattern
    .replace(/yyyy/g, year)
    .replace(/yy/g, year.slice(-2))
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/HH/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, second)
    .replace(/SSS/g, fraction)
}

export const getCurrentTimeTool = {
  name: "get-current-time",
  display_name: t("GET_CURRENT_TIME_DISPLAY_NAME"),
  description: t("GET_CURRENT_TIME_DESCRIPTION"),
  icon: "🕐",
  parameters: [
    {
      name: "timezone",
      type: "string",
      required: false,
      display_name: t("TIMEZONE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIMEZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "format",
      type: "string",
      required: false,
      display_name: t("FORMAT_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "iso", label: t("FORMAT_OPTION_ISO") },
          { value: "locale", label: t("FORMAT_OPTION_LOCALE") },
          { value: "unix", label: t("FORMAT_OPTION_UNIX") },
          { value: "custom", label: t("FORMAT_OPTION_CUSTOM") },
        ],
        hint: t("FORMAT_HINT"),
        width: "full",
      },
    },
    {
      name: "format_pattern",
      type: "string",
      required: false,
      display_name: t("FORMAT_PATTERN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("FORMAT_PATTERN_HINT"),
        placeholder: t("FORMAT_PATTERN_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    try {
      const timezone = str(args.parameters?.timezone)
      const rawFormat = str(args.parameters?.format) ?? "iso"
      const format =
        rawFormat === "unix" || rawFormat === "locale" || rawFormat === "iso" || rawFormat === "custom"
          ? rawFormat
          : "iso"
      const formatPattern = str(args.parameters?.format_pattern) || "yyyy-MM-dd"

      const date = new Date()
      const tz =
        timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC"

      const iso = date.toISOString()
      const locale = date.toLocaleString(undefined, { timeZone: tz })
      const unix = Math.floor(date.getTime() / 1000)

      const result = {
        iso,
        locale,
        unix,
        timezone: tz,
      }

      let current_time: string | number
      switch (format) {
        case "unix":
          current_time = unix
          break
        case "locale":
          current_time = locale
          break
        case "custom":
          current_time = formatDateByPattern(date, formatPattern, tz)
          break
        default:
          current_time = iso
      }

      return {
        current_time,
        format,
        ...(format === "custom" ? { format_pattern: formatPattern } : {}),
        ...result,
      } as JsonValue
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
      } as JsonValue
    }
  },
} satisfies ToolDefinition
