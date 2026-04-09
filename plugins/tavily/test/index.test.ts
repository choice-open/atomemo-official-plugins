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

// Vitest/rolldown may not understand `with { type: "text" }` markdown imports.
// Mock skill markdown modules so tests can focus on tool/credential behavior.
vi.mock("../src/tools/demo-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/tavily-search-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/tavily-extract-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/tavily-crawl-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/tavily-map-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/tavily-research-skill.md", () => ({ default: "" }))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { tavilyCredential } from "../src/credentials/tavily-credential"
import { tavilySearchTool } from "../src/tools/tavily-search"
import { tavilyExtractTool } from "../src/tools/tavily-extract"
import { tavilyCrawlTool } from "../src/tools/tavily-crawl"
import { tavilyMapTool } from "../src/tools/tavily-map"
import { tavilyResearchTool } from "../src/tools/tavily-research"
import { demoTool } from "../src/tools/demo"

describe("demo plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "demo-plugin",
        display_name: { en_US: "Demo Plugin" },
        description: { en_US: "A demo plugin" },
        icon: "🎛️",
        lang: "typescript",
        version: "0.5.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/demo-plugin",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should call all initialization methods when imported", async () => {
      // Create mock plugin methods
      const addTool = vi.fn()
      const addCredential = vi.fn()
      const run = vi.fn()

      // Replace the mock implementation
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        addCredential,
        run,
      })

      // Dynamically import the plugin to trigger initialization
      await import("../src/index")

      // Verify all methods were called
      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(tavilyCredential)
      expect(addTool).toHaveBeenCalledWith(tavilySearchTool)
      expect(addTool).toHaveBeenCalledWith(tavilyExtractTool)
      expect(addTool).toHaveBeenCalledWith(tavilyCrawlTool)
      expect(addTool).toHaveBeenCalledWith(tavilyMapTool)
      expect(addTool).toHaveBeenCalledWith(tavilyResearchTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("demo tool", () => {
    it("should have correct properties", () => {
      expect(demoTool).toEqual(
        expect.objectContaining({
          name: "demo-tool",
          icon: "🧰",
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

    it("should return correct message when invoked", async () => {
      const location = "Beijing"
      const result = await demoTool.invoke({
        args: { parameters: { location } },
      })

      expect(result).toEqual(
        expect.objectContaining({
          message: `Testing the plugin with location: ${location}`,
        }),
      )
    })
  })
})
