import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
    addModel: vi.fn(),
    run: vi.fn(),
  }),
}))

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
import { deepseekCredential } from "../src/credentials/deepseek"
import { deepseekChatModel } from "../src/models/deepseek-chat"
import { deepseekReasonerModel } from "../src/models/deepseek-reasoner"

describe("deepseek plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "deepseek",
        display_name: { en_US: "DeepSeek" },
        description: { en_US: "DeepSeek models" },
        icon: "🤖",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/deepseek",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(plugin.addModel).toBeDefined()
      expect(plugin.run).toBeDefined()
    })

    it("should call addCredential and addModel when imported", async () => {
      const addCredential = vi.fn()
      const addModel = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addCredential,
        addModel,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(deepseekCredential)
      expect(addModel).toHaveBeenCalledWith(deepseekChatModel)
      expect(addModel).toHaveBeenCalledWith(deepseekReasonerModel)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("deepseek credential", () => {
    it("should have correct properties", () => {
      expect(deepseekCredential).toEqual(
        expect.objectContaining({
          name: "deepseek-api-key",
          icon: "🔑",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "api_key",
              type: "encrypted_string",
              required: true,
            }),
          ]),
        }),
      )
    })

    it("should authenticate with endpoint and headers", async () => {
      const apiKey = "sk-test"
      const result = await deepseekCredential.authenticate({
        args: { credential: { api_key: apiKey }, extra: {} },
      })

      expect(result).toEqual(
        expect.objectContaining({
          adapter: "deepseek",
          endpoint: "https://api.deepseek.com/chat/completions",
          headers: expect.objectContaining({
            authorization: `Bearer ${apiKey}`,
          }),
          api_key: apiKey,
        }),
      )
    })

    it("should throw when api_key is empty", async () => {
      await expect(
        deepseekCredential.authenticate({
          args: { credential: { api_key: "" }, extra: {} },
        }),
      ).rejects.toThrow("credential api_key is empty")
    })
  })

  describe("deepseek models", () => {
    it("should have correct properties for deepseek-chat", () => {
      expect(deepseekChatModel).toEqual(
        expect.objectContaining({
          name: "deepseek-chat",
          model_type: "llm",
          icon: "🤖",
          pricing: expect.objectContaining({
            currency: "USD",
            input: 0.25,
            input_cache_read: 0.125,
            output: 0.38,
          }),
          override_parameters: expect.objectContaining({
            temperature: expect.objectContaining({
              default: 1,
              maximum: 2,
              minimum: 0,
            }),
          }),
        }),
      )
    })

    it("should have correct properties for deepseek-reasoner", () => {
      expect(deepseekReasonerModel).toEqual(
        expect.objectContaining({
          name: "deepseek-reasoner",
          model_type: "llm",
          pricing: expect.objectContaining({
            currency: "USD",
            input: 0.25,
            input_cache_read: 0.125,
            output: 0.38,
          }),
        }),
      )
    })
  })
})
