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

vi.mock("../src/tools/list-departments-skill.md", () => ({ default: "" }))
vi.mock("../src/tools/send-text-message-skill.md", () => ({ default: "" }))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { wechatWorkCredential } from "../src/credentials/wechat-work-credential"
import { listDepartmentsTool } from "../src/tools/list-departments"
import { sendTextMessageTool } from "../src/tools/send-text-message"

describe("wechat-work plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "wechat-work",
        display_name: { en_US: "WeChat Work" },
        description: { en_US: "Test" },
        icon: "🏢",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/wechat-work",
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
      const addTool = vi.fn()
      const addCredential = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        addCredential,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(wechatWorkCredential)
      expect(addTool).toHaveBeenCalledWith(listDepartmentsTool)
      expect(addTool).toHaveBeenCalledWith(sendTextMessageTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("tools", () => {
    it("list-departments should require credential selection", async () => {
      await expect(
        listDepartmentsTool.invoke({
          args: { parameters: {} },
        }),
      ).rejects.toThrow(/credential/i)
    })

    it("send-text-message should require credential and fields", async () => {
      await expect(
        sendTextMessageTool.invoke({
          args: { parameters: { agent_id: 1, touser: "u", content: "hi" } },
        }),
      ).rejects.toThrow(/credential/i)
    })
  })
})
