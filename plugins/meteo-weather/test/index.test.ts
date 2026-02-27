import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => key),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US", "zh-Hans"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue(undefined),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { getCurrentWeatherTool } from "../src/tools/get-current-weather"

describe("meteo-weather plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "meteo-weather",
        display_name: { en_US: "Meteo Weather", zh_Hans: "Meteo 天气" },
        description: {
          en_US: "Get current weather by city or location name",
          zh_Hans: "根据城市或地点名称获取当前天气",
        },
        icon: "🌤️",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/meteo-weather",
        locales: ["en-US", "zh-Hans"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should call addTool with getCurrentWeatherTool when imported", async () => {
      const addTool = vi.fn()
      const run = vi.fn()
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({ addTool, run })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addTool).toHaveBeenCalledWith(getCurrentWeatherTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("get-current-weather tool", () => {
    it("should have correct tool properties", () => {
      expect(getCurrentWeatherTool).toEqual(
        expect.objectContaining({
          name: "meteo-weather-get-current",
          icon: "🌤️",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "location",
              type: "string",
              required: true,
            }),
          ]),
        }),
      )
    })

    it("should return error when location is missing", async () => {
      const result = await getCurrentWeatherTool.invoke({
        args: { parameters: {} },
      })

      expect(result).toEqual(expect.objectContaining({ error: "Location is required" }))
    })

    it("should return error when location is not found", async () => {
      const result = await getCurrentWeatherTool.invoke({
        args: { parameters: { location: "NonExistentCityXYZ123" } },
      })

      expect(result).toEqual(expect.objectContaining({ error: expect.stringContaining("Could not find location") }))
    })

    it("should return weather data for a valid city", async () => {
      const geoRes = {
        results: [
          {
            id: 1816670,
            name: "Beijing",
            latitude: 39.9075,
            longitude: 116.39723,
            country: "China",
            timezone: "Asia/Shanghai",
          },
        ],
      }
      const forecastRes = {
        latitude: 39.9075,
        longitude: 116.39723,
        timezone: "Asia/Shanghai",
        current: {
          temperature_2m: 5.2,
          relative_humidity_2m: 45,
          apparent_temperature: 3.1,
          is_day: 1,
          precipitation: 0,
          weather_code: 0,
          cloud_cover: 10,
          pressure_msl: 1025,
          wind_speed_10m: 12,
          wind_direction_10m: 270,
        },
      }

      const fetchMock = vi.fn()
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(geoRes),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(forecastRes),
        })

      // vi.stubGlobal("fetch", fetchMock)

      const result = await getCurrentWeatherTool.invoke({
        args: { parameters: { location: "Beijing" } },
      })

      // vi.unstubAllGlobals()

      // expect(fetchMock).toHaveBeenCalledTimes(2)
      const obj = result as Record<string, unknown>
      console.log(obj)
      expect(obj).not.toHaveProperty("error")
      expect(obj).toHaveProperty("message")
      expect(obj).toHaveProperty("location", "Beijing, China")
      // expect(obj).toHaveProperty("condition", "Clear sky")
      // expect(obj).toHaveProperty("weather_code", 0)
      // expect(obj).toHaveProperty("temperature", 5.2)
      // expect(obj).toHaveProperty("humidity_percent", 45)
    })
  })
})
