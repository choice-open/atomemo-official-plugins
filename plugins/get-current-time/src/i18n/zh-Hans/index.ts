import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "获取当前时间",
  PLUGIN_DESCRIPTION: "获取当前日期与时间，可指定时区和输出格式。",
  DEMO_TOOL_DISPLAY_NAME: "演示工具",
  DEMO_TOOL_DESCRIPTION: "一个用于测试插件的工具",
  LOCATION_DISPLAY_NAME: "位置",
  LOCATION_HINT: "要测试的位置",
  LOCATION_PLACEHOLDER: "输入要测试的位置",
  GET_CURRENT_TIME_DISPLAY_NAME: "获取当前时间",
  GET_CURRENT_TIME_DESCRIPTION: "获取当前日期与时间，可指定时区和输出格式。",
  TIMEZONE_DISPLAY_NAME: "时区",
  TIMEZONE_HINT:
    "IANA 时区（如 Asia/Shanghai、America/New_York），留空则使用系统时区。",
  TIMEZONE_PLACEHOLDER: "如 Asia/Shanghai",
  FORMAT_DISPLAY_NAME: "格式",
  FORMAT_HINT: "主字段 current_time 的输出格式。",
  FORMAT_OPTION_ISO: "ISO 8601",
  FORMAT_OPTION_LOCALE: "本地化字符串",
  FORMAT_OPTION_UNIX: "Unix 时间戳",
  FORMAT_OPTION_CUSTOM: "自定义格式",
  FORMAT_PATTERN_DISPLAY_NAME: "自定义格式模式",
  FORMAT_PATTERN_HINT:
    "当格式为「自定义格式」时使用。占位符：yyyy 年、MM 月、dd 日、HH 时、mm 分、ss 秒、SSS 毫秒。例如：yyyy-MM-dd HH:mm:ss",
  FORMAT_PATTERN_PLACEHOLDER: "如 yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss",
} satisfies Translation

export default zh_Hans
