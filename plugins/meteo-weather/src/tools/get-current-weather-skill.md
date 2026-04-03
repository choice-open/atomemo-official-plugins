# Get Current Weather Tool Documentation

## Tool

- **Name**: `meteo-weather-get-current`
- **Purpose**: Resolves a place name to coordinates (geocoding), then returns current conditions from Open-Meteo (temperature, wind, humidity, precipitation, etc.) as structured JSON plus a short human-readable summary.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `location` | `string` | `true` | `input` | City or place name (supports common Chinese names; internally normalized for geocoding). | `"Beijing"` |
| `temperature_unit` | `string` | `false` | `select` | `celsius` (default) or `fahrenheit`. | `"celsius"` |
| `wind_speed_unit` | `string` | `false` | `select` | `kmh` (default), `ms`, `mph`, or `kn`. | `"kmh"` |
| `precipitation_unit` | `string` | `false` | `select` | `mm` (default) or `inch`. | `"mm"` |
| `timezone` | `string` | `false` | `input` | IANA timezone for timestamps (e.g. `Asia/Shanghai`). Use `auto` to use the resolved location timezone. Omit for API default (GMT). | `"auto"` |

## Tool Input Example

```json
{
  "parameters": {
    "location": "Tokyo",
    "temperature_unit": "celsius",
    "wind_speed_unit": "kmh",
    "precipitation_unit": "mm",
    "timezone": "auto"
  }
}
```

## Tool Output Example

Success (shape may omit null fields):

```json
{
  "message": "Current weather in Tokyo, Japan: Clear sky. Temperature: 22°C, ...",
  "location": "Tokyo, Japan",
  "condition": "Clear sky",
  "weather_code": 0,
  "temperature": 22.1,
  "apparent_temperature": 21.5,
  "humidity_percent": 55,
  "wind_speed": 12.3,
  "wind_direction_degrees": 180,
  "timezone": "Asia/Tokyo",
  "is_day": true
}
```

Errors:

```json
{ "error": "Location is required" }
```

```json
{ "error": "Could not find location: …" }
```

```json
{ "error": "Failed to fetch weather: …" }
```
