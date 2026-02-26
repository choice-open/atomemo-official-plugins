import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "Meteo 天气",
  PLUGIN_DESCRIPTION: "根据城市或地点名称查询当前天气（Open-Meteo）",
  GET_CURRENT_WEATHER_TOOL_DISPLAY_NAME: "获取当前天气",
  GET_CURRENT_WEATHER_TOOL_DESCRIPTION: "获取指定城市或地点的当前天气",
  LOCATION_DISPLAY_NAME: "地点",
  LOCATION_HINT: "城市名或地点，如：北京、东京",
  LOCATION_PLACEHOLDER: "如：北京",
  TEMPERATURE_UNIT_DISPLAY_NAME: "温度单位",
  TEMPERATURE_UNIT_HINT: "celsius 或 fahrenheit",
  TEMPERATURE_UNIT_OPTION_CELSIUS: "摄氏度 (°C)",
  TEMPERATURE_UNIT_OPTION_FAHRENHEIT: "华氏度 (°F)",
  WIND_SPEED_UNIT_DISPLAY_NAME: "风速单位",
  WIND_SPEED_UNIT_HINT: "kmh、ms、mph 或 kn",
  WIND_SPEED_OPTION_KMH: "千米/时 (km/h)",
  WIND_SPEED_OPTION_MS: "米/秒 (m/s)",
  WIND_SPEED_OPTION_MPH: "英里/时 (mph)",
  WIND_SPEED_OPTION_KN: "节 (kn)",
  PRECIPITATION_UNIT_DISPLAY_NAME: "降水单位",
  PRECIPITATION_UNIT_HINT: "mm 或 inch",
  PRECIPITATION_OPTION_MM: "毫米 (mm)",
  PRECIPITATION_OPTION_INCH: "英寸 (inch)",
  TIMEZONE_DISPLAY_NAME: "时区",
  TIMEZONE_HINT: "如 Asia/Shanghai，留空则根据地点自动选择",
  TIMEZONE_PLACEHOLDER: "如 Asia/Shanghai 或 auto",
} satisfies Translation

export default zh_Hans
