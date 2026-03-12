import { describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
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

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { googleSearchApiCredential } from "../src/credentials/google-search-api"
import { googleSearchTool } from "../src/tools/google-search"

describe("google-search plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "google-search",
        display_name: { en_US: "Google Search" },
        description: {
          en_US: "Search the web using Google Custom Search JSON API",
        },
        icon: "🔍",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-search",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(typeof plugin.addCredential).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should call addCredential and addTool when imported", async () => {
      const addCredential = vi.fn()
      const addTool = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addCredential,
        addTool,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(googleSearchApiCredential)
      expect(addTool).toHaveBeenCalledWith(googleSearchTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("google search tool", () => {
    it("should have correct properties", () => {
      expect(googleSearchTool).toEqual(
        expect.objectContaining({
          name: "google-search",
          icon: "🔍",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "api_credential",
              type: "credential_id",
              required: true,
            }),
            expect.objectContaining({
              name: "query",
              type: "string",
              required: true,
            }),
          ]),
        }),
      )
    })

    it("should throw when credential is missing", async () => {
      await expect(
        googleSearchTool.invoke({
          args: {
            parameters: { query: "test", num: 5 },
            credentials: {},
          },
        }),
      ).rejects.toThrow("Google Search requires a valid API credential")
    })
  })
})
