import { describe, expect, it, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {} }),
}))

import { getCurrentTimeTool } from "../src/tools/get-current-time"

describe("get-current-time tool", () => {
  describe("tool definition", () => {
    it("should have correct properties", () => {
      expect(getCurrentTimeTool).toEqual(
        expect.objectContaining({
          name: "get-current-time",
          icon: "🕐",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "timezone",
              type: "string",
              required: false,
            }),
            expect.objectContaining({
              name: "format",
              type: "string",
              required: false,
            }),
          ]),
        }),
      )
    })
  })

  describe("invoke", () => {
    it("should return current time in ISO format by default", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: {} },
      })

      const r = result as unknown as {
        current_time: string
        iso: string
        locale: string
        unix: number
        timezone: string
      }
      expect(r.current_time).toBe(r.iso)
      expect(r.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(r.timezone).toBeDefined()
      expect(r.locale).toBeDefined()
      expect(typeof r.locale).toBe("string")
      expect(Number.isInteger(r.unix)).toBe(true)
    })

    it("should return current_time as unix timestamp when format is unix", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: { format: "unix" } },
      })

      const r = result as unknown as {
        current_time: number
        iso: string
        unix: number
      }
      expect(typeof r.current_time).toBe("number")
      expect(r.current_time).toBe(r.unix)
      expect(r.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it("should return current_time as locale string when format is locale", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: { format: "locale" } },
      })

      const r = result as unknown as { current_time: string; locale: string }
      expect(r.current_time).toBe(r.locale)
      expect(typeof r.locale).toBe("string")
    })

    it("should use specified timezone in result", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: { timezone: "Asia/Shanghai" } },
      })

      const r = result as unknown as {
        timezone: string
        iso: string
        unix: number
        locale: string
      }
      expect(r.timezone).toBe("Asia/Shanghai")
      expect(r.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(Number.isInteger(r.unix)).toBe(true)
      expect(typeof r.locale).toBe("string")
    })

    it("should return all fields as JSON-serializable types", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: {
          "format": "unix"
        } },
      })

      const obj = result as Record<string, unknown>
      expect(
        typeof obj.current_time === "string" ||
          typeof obj.current_time === "number",
      ).toBe(true)
      expect(typeof obj.iso).toBe("string")
      expect(typeof obj.locale).toBe("string")
      expect(typeof obj.unix).toBe("number")
      expect(typeof obj.timezone).toBe("string")
      expect(Number.isInteger(obj.unix)).toBe(true)
    })

    it("should support custom formatted time when format is custom", async () => {
      const pattern = "yyyy-MM-dd"
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: { format: "custom", format_pattern: pattern } },
      })

      const r = result as unknown as {
        current_time: string
        format: string
        format_pattern?: string
        timezone: string
      }

      expect(r.format).toBe("custom")
      expect(r.format_pattern).toBe(pattern)
      expect(typeof r.current_time).toBe("string")
      expect(r.current_time).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof r.timezone).toBe("string")
    })

    it("should fall back to iso when format is invalid", async () => {
      const result = await getCurrentTimeTool.invoke({
        args: { parameters: { format: "unknown-format" } },
      })

      const r = result as unknown as {
        current_time: string
        iso: string
        format: string
      }

      expect(r.format).toBe("iso")
      expect(r.current_time).toBe(r.iso)
    })
  })
})
