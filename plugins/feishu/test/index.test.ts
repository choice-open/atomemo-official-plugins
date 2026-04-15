import { describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
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

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { feishuAppCredential } from "../src/credentials/feishu-app-credential"
import { allFeishuTools } from "../src/tools/feishu-tools"

describe("feishu plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "feishu",
        display_name: { en_US: "Feishu" },
        description: { en_US: "Feishu plugin" },
        icon: "🎛️",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/feishu",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(plugin.run).toBeDefined()
    })

    it("should register credential and all tools when imported", async () => {
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
      expect(addCredential).toHaveBeenCalledWith(feishuAppCredential)
      expect(addTool).toHaveBeenCalledTimes(allFeishuTools.length)
      for (const tool of allFeishuTools) {
        expect(addTool).toHaveBeenCalledWith(tool)
      }
      expect(run).toHaveBeenCalled()
    })
  })

  describe("feishu api tools", () => {
    it("should expose expected entry metadata", () => {
      expect(allFeishuTools[0]).toEqual(
        expect.objectContaining({
          name: "feishu-contact_create_user",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "credential_id",
              type: "credential_id",
              required: true,
            }),
          ]),
        }),
      )
    })
  })
})
