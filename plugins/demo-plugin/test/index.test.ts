import { describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
    addTool: vi.fn(),
    addModel: vi.fn(),
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
import { demoCredential } from "../src/credentials/demo"
import { demoModelChat } from "../src/models/demo-chat"
import { demoModelReasoning } from "../src/models/demo-reasoning"
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
      expect(plugin.addCredential).toBeDefined()
      expect(typeof plugin.addCredential).toBe("function")
      expect(plugin.addTool).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(plugin.addModel).toBeDefined()
      expect(typeof plugin.addModel).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should call all initialization methods when imported", async () => {
      // Create mock plugin methods
      const addCredential = vi.fn()
      const addTool = vi.fn()
      const addModel = vi.fn()
      const run = vi.fn()

      // Replace the mock implementation
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addCredential,
        addTool,
        addModel,
        run,
      })

      // Dynamically import the plugin to trigger initialization
      await import("../src/index")

      // Verify all methods were called
      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(demoCredential)
      expect(addModel).toHaveBeenCalledWith(demoModelChat)
      expect(addModel).toHaveBeenCalledWith(demoModelReasoning)
      expect(addTool).toHaveBeenCalledWith(demoTool)
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

  describe("demo credential", () => {
    it("should have correct properties", () => {
      expect(demoCredential).toEqual(
        expect.objectContaining({
          name: "demo-deepseek-api-key",
          icon: "🔑",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "api_key",
              type: "string",
              required: true,
            }),
          ]),
        }),
      )
    })

    it("should authenticate with correct values", async () => {
      const apiKey = "test-api-key"
      const model = "deepseek-chat"
      const result = await demoCredential.authenticate({
        args: {
          credentials: { api_key: apiKey },
          parameters: { model },
        },
      })

      expect(result).toEqual(
        expect.objectContaining({
          adapter: "deepseek",
          endpoint: "https://api.deepseek.com/chat/completions",
          model,
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
          }),
        }),
      )
    })

    it("should use default model if not provided", async () => {
      const apiKey = "test-api-key"
      const result = await demoCredential.authenticate({
        args: {
          credentials: { api_key: apiKey },
          parameters: {},
        },
      })

      expect(result).toEqual(
        expect.objectContaining({
          model: "deepseek-chat",
        }),
      )
    })
  })

  describe("demo models", () => {
    it("should have correct properties for chat model", () => {
      expect(demoModelChat).toEqual(
        expect.objectContaining({
          name: "demo-deepseek-chat",
          model_type: "llm",
          icon: "🤖",
          override_parameters: expect.objectContaining({
            temperature: expect.objectContaining({
              default: 1.3,
              maximum: 2.0,
              minimum: 0.0,
            }),
          }),
        }),
      )
    })

    it("should have correct properties for reasoning model", () => {
      expect(demoModelReasoning).toEqual(
        expect.objectContaining({
          name: "demo-deepseek-reasoning",
          model_type: "llm",
          icon: "🤖",
          override_parameters: expect.objectContaining({
            temperature: expect.objectContaining({
              default: 1.5,
              maximum: 2.0,
              minimum: 0.0,
            }),
          }),
        }),
      )
    })
  })
})
