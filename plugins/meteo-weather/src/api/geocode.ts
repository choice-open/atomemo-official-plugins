import { GEOCODING_URL } from "../constants"

export interface GeoLocation {
  latitude: number
  longitude: number
  name: string
  country: string
  timezone?: string
}

/**
 * Resolve a location name to coordinates via Open-Meteo Geocoding API.
 * Returns `null` when the location cannot be found or the request fails.
 */
export async function geocode(name: string): Promise<GeoLocation | null> {
  const url = `${GEOCODING_URL}?${new URLSearchParams({ name, count: "1" })}`

  try {
    const res = await fetch(url)
    if (!res.ok) return null

    const data = (await res.json()) as {
      results?: Array<GeoLocation>
    }
    return data.results?.[0] ?? null
  } catch {
    return null
  }
}
