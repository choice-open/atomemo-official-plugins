import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { fetchCurrentWeather, type ForecastOptions } from "../api/forecast"
import { geocode } from "../api/geocode"
import { TEMP_LABELS, WEATHER_CODE_MAP, WIND_SPEED_LABELS } from "../constants"
import { locationToEnglish } from "../utils/chinese-location"
import { t } from "../i18n/i18n-node"

function weatherCodeToText(code: number): string {
  return WEATHER_CODE_MAP[code] ?? `Unknown (${code})`
}

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim()
  return undefined
}

function num(v: unknown): number | undefined {
  if (v == null || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function compact(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
}

function extractOptions(
  p: Record<string, unknown>,
  autoTimezone?: string,
): { options: ForecastOptions; tempUnit: string; windUnit: string; precipUnit: string } {
  const tempUnit = str(p.temperature_unit) ?? "celsius"
  const windUnit = str(p.wind_speed_unit) ?? "kmh"
  const precipUnit = str(p.precipitation_unit) ?? "mm"

  let tz = str(p.timezone)
  if (tz?.toLowerCase() === "auto" && autoTimezone) tz = autoTimezone

  return {
    tempUnit,
    windUnit,
    precipUnit,
    options: {
      temperature_unit: tempUnit,
      wind_speed_unit: windUnit,
      precipitation_unit: precipUnit,
      timezone: tz,
      elevation: num(p.elevation),
      timeformat: str(p.timeformat),
      past_days: num(p.past_days),
      forecast_days: num(p.forecast_days),
      forecast_hours: num(p.forecast_hours),
      past_hours: num(p.past_hours),
      models: str(p.models),
      cell_selection: str(p.cell_selection),
      start_date: str(p.start_date),
      end_date: str(p.end_date),
      start_hour: str(p.start_hour),
      end_hour: str(p.end_hour),
    },
  }
}

const parameters: ToolDefinition["parameters"] = [
  {
    name: "location",
    type: "string",
    required: true,
    display_name: t("LOCATION_DISPLAY_NAME"),
    ai: { llm_description: { en_US: "City name or location to get weather for, e.g. Beijing, Tokyo, London" } },
    ui: { component: "input", hint: t("LOCATION_HINT"), placeholder: t("LOCATION_PLACEHOLDER"), support_expression: true, width: "full" },
  },
  {
    name: "temperature_unit",
    type: "string",
    required: false,
    default: "celsius",
    enum: ["celsius", "fahrenheit"],
    display_name: t("TEMPERATURE_UNIT_DISPLAY_NAME"),
    ai: { llm_description: { en_US: "Temperature unit: celsius or fahrenheit. Default celsius." } },
    ui: {
      component: "select",
      hint: t("TEMPERATURE_UNIT_HINT"),
      support_expression: true,
      options: [
        { label: t("TEMPERATURE_UNIT_OPTION_CELSIUS"), value: "celsius" },
        { label: t("TEMPERATURE_UNIT_OPTION_FAHRENHEIT"), value: "fahrenheit" },
      ],
    },
  },
  {
    name: "wind_speed_unit",
    type: "string",
    required: false,
    default: "kmh",
    enum: ["kmh", "ms", "mph", "kn"],
    display_name: t("WIND_SPEED_UNIT_DISPLAY_NAME"),
    ai: { llm_description: { en_US: "Wind speed unit: kmh, ms, mph, or kn. Default kmh." } },
    ui: {
      component: "select",
      hint: t("WIND_SPEED_UNIT_HINT"),
      support_expression: true,
      options: [
        { label: t("WIND_SPEED_OPTION_KMH"), value: "kmh" },
        { label: t("WIND_SPEED_OPTION_MS"), value: "ms" },
        { label: t("WIND_SPEED_OPTION_MPH"), value: "mph" },
        { label: t("WIND_SPEED_OPTION_KN"), value: "kn" },
      ],
    },
  },
  {
    name: "precipitation_unit",
    type: "string",
    required: false,
    default: "mm",
    enum: ["mm", "inch"],
    display_name: t("PRECIPITATION_UNIT_DISPLAY_NAME"),
    ai: { llm_description: { en_US: "Precipitation unit: mm or inch. Default mm." } },
    ui: {
      component: "select",
      hint: t("PRECIPITATION_UNIT_HINT"),
      support_expression: true,
      options: [
        { label: t("PRECIPITATION_OPTION_MM"), value: "mm" },
        { label: t("PRECIPITATION_OPTION_INCH"), value: "inch" },
      ],
    },
  },
  {
    name: "timezone",
    type: "string",
    required: false,
    display_name: t("TIMEZONE_DISPLAY_NAME"),
    ai: { llm_description: { en_US: "Timezone for timestamps, e.g. Asia/Shanghai. Use 'auto' to resolve from coordinates. Omit for GMT." } },
    ui: { component: "input", hint: t("TIMEZONE_HINT"), placeholder: t("TIMEZONE_PLACEHOLDER"), support_expression: true },
  },
]

export const getCurrentWeatherTool: ToolDefinition = {
  name: "meteo-weather-get-current",
  display_name: t("GET_CURRENT_WEATHER_TOOL_DISPLAY_NAME"),
  description: t("GET_CURRENT_WEATHER_TOOL_DESCRIPTION"),
  icon: "🌤️",
  parameters,

  async invoke({ args }): Promise<JsonValue> {

    console.log(`invoke: ${JSON.stringify(args)}`)

    const location = str(args.parameters?.location)
    if (!location) {
      return { error: "Location is required" } as JsonValue
    }

    const locationForGeocode = locationToEnglish(location)
    const geo = await geocode(locationForGeocode)
    if (!geo) {
      return { error: `Could not find location: ${location}` } as JsonValue
    }

    const { options, tempUnit, windUnit, precipUnit } = extractOptions(
      args.parameters ?? {},
      geo.timezone,
    )

    try {
      const { current, timezone } = await fetchCurrentWeather(
        geo.latitude,
        geo.longitude,
        options,
      )

      if (!current) {
        return { error: "No current weather data returned" } as JsonValue
      }

      const condition = weatherCodeToText(current.weather_code ?? 0)
      const tl = TEMP_LABELS[tempUnit] ?? "°C"
      const wl = WIND_SPEED_LABELS[windUnit] ?? "km/h"
      const pl = precipUnit === "inch" ? "inch" : "mm"

      const temp = current.temperature_2m ?? 0
      const feelsLike = current.apparent_temperature ?? temp

      const message = [
        `Current weather in ${geo.name}, ${geo.country}: ${condition}.`,
        `Temperature: ${temp}${tl}, Feels like: ${feelsLike}${tl}, Humidity: ${current.relative_humidity_2m ?? 0}%.`,
        `Wind: ${current.wind_speed_10m ?? 0} ${wl}${current.wind_direction_10m != null ? ` from ${current.wind_direction_10m}°` : ""}${current.wind_gusts_10m != null ? `, Gusts: ${current.wind_gusts_10m} ${wl}` : ""}.`,
        current.cloud_cover != null && `Cloud cover: ${current.cloud_cover}%.`,
        current.pressure_msl != null && `Pressure (MSL): ${current.pressure_msl} hPa.`,
        current.precipitation != null && current.precipitation > 0 && `Precipitation: ${current.precipitation} ${pl}.`,
      ]
        .filter(Boolean)
        .join(" ")

      return compact({
        message,
        location: `${geo.name}, ${geo.country}`,
        condition,
        weather_code: current.weather_code ?? 0,
        temperature: current.temperature_2m,
        apparent_temperature: current.apparent_temperature,
        humidity_percent: current.relative_humidity_2m,
        wind_speed: current.wind_speed_10m,
        wind_direction_degrees: current.wind_direction_10m,
        wind_gusts: current.wind_gusts_10m,
        cloud_cover_percent: current.cloud_cover,
        pressure_msl_hpa: current.pressure_msl,
        surface_pressure_hpa: current.surface_pressure,
        precipitation: current.precipitation,
        rain: current.rain,
        showers: current.showers,
        snowfall: current.snowfall,
        is_day: current.is_day === 1,
        timezone,
      }) as JsonValue
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { error: `Failed to fetch weather: ${msg}` } as JsonValue
    }
  },
} satisfies ToolDefinition
