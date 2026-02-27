import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Meteo Weather",
  PLUGIN_DESCRIPTION:
    "Get current weather by city or location name (Open-Meteo)",
  GET_CURRENT_WEATHER_TOOL_DISPLAY_NAME: "Get Current Weather",
  GET_CURRENT_WEATHER_TOOL_DESCRIPTION:
    "Get current weather for a given city or location",
  LOCATION_DISPLAY_NAME: "Location",
  LOCATION_HINT: "City name or location, e.g. Beijing, Tokyo",
  LOCATION_PLACEHOLDER: "e.g. Beijing",
  TEMPERATURE_UNIT_DISPLAY_NAME: "Temperature unit",
  TEMPERATURE_UNIT_HINT: "celsius or fahrenheit",
  TEMPERATURE_UNIT_OPTION_CELSIUS: "Celsius (°C)",
  TEMPERATURE_UNIT_OPTION_FAHRENHEIT: "Fahrenheit (°F)",
  WIND_SPEED_UNIT_DISPLAY_NAME: "Wind speed unit",
  WIND_SPEED_UNIT_HINT: "kmh, ms, mph, or kn",
  WIND_SPEED_OPTION_KMH: "km/h",
  WIND_SPEED_OPTION_MS: "m/s",
  WIND_SPEED_OPTION_MPH: "mph",
  WIND_SPEED_OPTION_KN: "kn",
  PRECIPITATION_UNIT_DISPLAY_NAME: "Precipitation unit",
  PRECIPITATION_UNIT_HINT: "mm or inch",
  PRECIPITATION_OPTION_MM: "mm",
  PRECIPITATION_OPTION_INCH: "inch",
  TIMEZONE_DISPLAY_NAME: "Timezone",
  TIMEZONE_HINT: "e.g. Asia/Shanghai, or leave empty for auto from location",
  TIMEZONE_PLACEHOLDER: "e.g. Asia/Shanghai or auto",
} satisfies BaseTranslation

export default en_US
