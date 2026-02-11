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
import { openaiCredential } from "../src/credentials/openai"
import { gpt4oModel } from "../src/models/gpt-4o"
import { gpt4oMiniModel } from "../src/models/gpt-4o-mini"
import { o1Model } from "../src/models/o1"
import { o1MiniModel } from "../src/models/o1-mini"

describe("openai plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "openai",
        display_name: { en_US: "OpenAI" },
        description: { en_US: "OpenAI models" },
        icon: "🤖",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/openai",
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
      expect(addCredential).toHaveBeenCalledWith(openaiCredential)
      expect(addModel).toHaveBeenCalledWith(gpt4oModel)
      expect(addModel).toHaveBeenCalledWith(gpt4oMiniModel)
      expect(addModel).toHaveBeenCalledWith(o1Model)
      expect(addModel).toHaveBeenCalledWith(o1MiniModel)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("openai credential", () => {
    it("should have correct properties", () => {
      expect(openaiCredential).toEqual(
        expect.objectContaining({
          name: "openai-api-key",
          icon: "🔑",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "api_key",
              type: "string",
              required: true,
            }),
            expect.objectContaining({
              name: "organization_id",
              type: "string",
              required: false,
            }),
            expect.objectContaining({
              name: "project_id",
              type: "string",
              required: false,
            }),
          ]),
        }),
      )
    })

    it("should authenticate and map model name", async () => {
      const apiKey = "sk-test"
      const result = await openaiCredential.authenticate({
        args: {
          credential: {
            api_key: apiKey,
            organization_id: "org_123",
            project_id: "proj_456",
          },
          extra: { model: "openai-gpt-4o" },
        },
      })

      expect(result).toEqual(
        expect.objectContaining({
          adapter: "openai",
          endpoint: "https://api.openai.com/v1/chat/completions",
          model: "gpt-4o",
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
            "OpenAI-Organization": "org_123",
            "OpenAI-Project": "proj_456",
          }),
        }),
      )
    })

    it("should use gpt-4o when model not in extra", async () => {
      const result = await openaiCredential.authenticate({
        args: { credential: { api_key: "sk-x" }, extra: {} },
      })
      expect(result.model).toBe("gpt-4o")
    })
  })

  describe("openai models", () => {
    it("should have correct properties for gpt-4o", () => {
      expect(gpt4oModel).toEqual(
        expect.objectContaining({
          name: "gpt-4o",
          model_type: "llm",
          icon: "🤖",
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

    it("should have correct properties for o1 (no temperature)", () => {
      expect(o1Model).toEqual(
        expect.objectContaining({
          name: "o1",
          model_type: "llm",
          unsupported_parameters: expect.arrayContaining(["temperature"]),
        }),
      )
    })
  })
})
