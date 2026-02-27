import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Get Current Time",
  PLUGIN_DESCRIPTION:
    "Get the current date and time, optionally in a specified timezone and format.",
  DEMO_TOOL_DISPLAY_NAME: "Demo Tool",
  DEMO_TOOL_DESCRIPTION: "A tool for testing the plugin",
  LOCATION_DISPLAY_NAME: "Location",
  LOCATION_HINT: "The location to test",
  LOCATION_PLACEHOLDER: "Enter the location to test",
  GET_CURRENT_TIME_DISPLAY_NAME: "Get Current Time",
  GET_CURRENT_TIME_DESCRIPTION:
    "Get the current date and time, optionally in a specified timezone and format.",
  TIMEZONE_DISPLAY_NAME: "Timezone",
  TIMEZONE_HINT:
    "IANA timezone (e.g. Asia/Shanghai, America/New_York). Leave empty for system timezone.",
  TIMEZONE_PLACEHOLDER: "e.g. Asia/Shanghai",
  FORMAT_DISPLAY_NAME: "Format",
  FORMAT_HINT: "Output format for the primary current_time field.",
  FORMAT_OPTION_ISO: "ISO 8601",
  FORMAT_OPTION_LOCALE: "Locale string",
  FORMAT_OPTION_UNIX: "Unix timestamp",
  FORMAT_OPTION_CUSTOM: "Custom pattern",
  FORMAT_PATTERN_DISPLAY_NAME: "Custom format pattern",
  FORMAT_PATTERN_HINT:
    "Used when Format is Custom. Placeholders: yyyy (year), MM (month), dd (day), HH (hour), mm (minute), ss (second), SSS (ms). Example: yyyy-MM-dd HH:mm:ss",
  FORMAT_PATTERN_PLACEHOLDER: "e.g. yyyy-MM-dd or yyyy-MM-dd HH:mm:ss",
} satisfies BaseTranslation

export default en_US
