/** Open-Meteo API base URLs */
export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

/** Current weather variables requested from the API */
export const CURRENT_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",")

/**
 * WMO Weather interpretation codes (WW)
 * @see https://open-meteo.com/en/docs
 */
export const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
}

export const WIND_SPEED_LABELS: Record<string, string> = {
  kmh: "km/h",
  ms: "m/s",
  mph: "mph",
  kn: "kn",
}

export const TEMP_LABELS: Record<string, string> = {
  celsius: "°C",
  fahrenheit: "°F",
}
