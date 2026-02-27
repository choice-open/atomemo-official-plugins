import { CURRENT_VARIABLES, FORECAST_URL } from "../constants"

/** All optional API query parameters per https://open-meteo.com/en/docs */
export interface ForecastOptions {
  temperature_unit?: string
  wind_speed_unit?: string
  precipitation_unit?: string
  timezone?: string
  elevation?: number
  timeformat?: string
  past_days?: number
  forecast_days?: number
  forecast_hours?: number
  past_hours?: number
  models?: string
  cell_selection?: string
  start_date?: string
  end_date?: string
  start_hour?: string
  end_hour?: string
}

export interface CurrentWeather {
  temperature_2m?: number
  relative_humidity_2m?: number
  apparent_temperature?: number
  is_day?: number
  precipitation?: number
  rain?: number
  showers?: number
  snowfall?: number
  weather_code?: number
  cloud_cover?: number
  pressure_msl?: number
  surface_pressure?: number
  wind_speed_10m?: number
  wind_direction_10m?: number
  wind_gusts_10m?: number
}

export interface ForecastResult {
  current: CurrentWeather | undefined
  timezone: string | undefined
}

/** Convert non-empty option values to query string entries. */
function buildQuery(opts: ForecastOptions): Record<string, string> {
  const q: Record<string, string> = {}

  const addStr = (key: keyof ForecastOptions) => {
    const v = opts[key]
    if (typeof v === "string" && v) q[key] = v
  }
  const addNum = (key: keyof ForecastOptions, min?: number, max?: number) => {
    const v = opts[key]
    if (v == null) return
    let n = Number(v)
    if (Number.isNaN(n)) return
    if (min != null) n = Math.max(min, n)
    if (max != null) n = Math.min(max, n)
    q[key] = String(n)
  }

  addStr("temperature_unit")
  addStr("wind_speed_unit")
  addStr("precipitation_unit")
  addStr("timezone")
  addStr("timeformat")
  addStr("models")
  addStr("cell_selection")
  addStr("start_date")
  addStr("end_date")
  addStr("start_hour")
  addStr("end_hour")

  addNum("elevation")
  addNum("past_days", 0, 92)
  addNum("forecast_days", 0, 16)
  addNum("forecast_hours", 1)
  addNum("past_hours", 1)

  return q
}

/** Fetch current weather from Open-Meteo Forecast API. */
export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  options: ForecastOptions = {},
): Promise<ForecastResult> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: CURRENT_VARIABLES,
    ...buildQuery(options),
  })


  console.log(`fetchCurrentWeather: ${FORECAST_URL}?${params}`)

  const res = await fetch(`${FORECAST_URL}?${params}`)
  if (!res.ok) {
    throw new Error(`Open-Meteo API responded with HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    current?: CurrentWeather
    timezone?: string
  }
  return { current: data.current, timezone: data.timezone }
}
