import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
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

vi.mock("../src/tools/hubspot-plugin-status-skill.md", () => ({
  default: "# HubSpot Plugin Status Tool",
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { hubspotPluginStatusTool } from "../src/tools/hubspot-plugin-status"

describe("hubspot plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "hubspot",
        display_name: { en_US: "HubSpot" },
        description: { en_US: "HubSpot starter scaffold plugin" },
        icon: "🧡",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/hubspot",
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
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addTool).toHaveBeenCalledWith(hubspotPluginStatusTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("hubspot-plugin-status tool", () => {
    it("should have correct properties", () => {
      expect(hubspotPluginStatusTool).toEqual(
        expect.objectContaining({
          name: "hubspot-plugin-status",
          icon: "🧡",
          skill: expect.stringContaining("# HubSpot Plugin Status Tool"),
          parameters: [],
        }),
      )
    })

    it("should return the scaffold-only contract when invoked", async () => {
      const result = await hubspotPluginStatusTool.invoke({
        args: { parameters: {} },
      })

      expect(result).toEqual({
        status: "scaffold_only",
        plugin: "hubspot",
        credentials_configured: false,
        planned_resources: [
          "contact",
          "company",
          "contactList",
          "deal",
          "engagement",
          "ticket",
        ],
        planned_auth: ["oauth2", "private_app_token"],
        note: "No real HubSpot operations are implemented yet.",
      })
    })
  })
})
