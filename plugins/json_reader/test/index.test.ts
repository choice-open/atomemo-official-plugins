import { describe, expect, it, type Mock, vi } from "vitest"

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

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { readJsonTool } from "../src/tools/read-json"

describe("json_reader plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "json_reader",
        display_name: { en_US: "JSON Reader" },
        description: {
          en_US:
            "Read a file and parse it as a JSON object, with BOM header support",
        },
        icon: "📄",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/json_reader",
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
      expect(addTool).toHaveBeenCalledWith(readJsonTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("read-json tool", () => {
    it("should have correct properties", () => {
      expect(readJsonTool).toEqual(
        expect.objectContaining({
          name: "read-json",
          icon: "📄",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "file",
              type: "file_ref",
              required: true,
            }),
          ]),
        }),
      )
    })

    it("should parse valid JSON from base64 content", async () => {
      const jsonData = { hello: "world", num: 42 }
      const base64Content = Buffer.from(JSON.stringify(jsonData)).toString(
        "base64",
      )

      const mockContext = {
        files: {
          parseFileRef: vi.fn().mockReturnValue({ filename: "test.json" }),
          download: vi.fn().mockResolvedValue({
            content: base64Content,
            filename: "test.json",
            mime_type: "application/json",
          }),
        },
      }

      const result = await readJsonTool.invoke({
        args: { parameters: { file: "some-file-ref" } },
        context: mockContext,
      } as any)

      expect(result).toEqual(jsonData)
    })

    it("should handle UTF-8 BOM", async () => {
      const jsonData = { bom: "test" }
      const jsonBytes = Buffer.from(JSON.stringify(jsonData))
      const bomBytes = Buffer.from([0xef, 0xbb, 0xbf])
      const withBom = Buffer.concat([bomBytes, jsonBytes])
      const base64Content = withBom.toString("base64")

      const mockContext = {
        files: {
          parseFileRef: vi.fn().mockReturnValue({ filename: "test.json" }),
          download: vi.fn().mockResolvedValue({
            content: base64Content,
            filename: "test.json",
            mime_type: "application/json",
          }),
        },
      }

      const result = await readJsonTool.invoke({
        args: { parameters: { file: "some-file-ref" } },
        context: mockContext,
      } as any)

      expect(result).toEqual(jsonData)
    })

    it("should handle UTF-16 LE BOM", async () => {
      const jsonData = { encoding: "utf16le" }
      const jsonString = JSON.stringify(jsonData)
      const utf16leBytes = Buffer.from(jsonString, "utf16le")
      const bomBytes = Buffer.from([0xff, 0xfe])
      const withBom = Buffer.concat([bomBytes, utf16leBytes])
      const base64Content = withBom.toString("base64")

      const mockContext = {
        files: {
          parseFileRef: vi.fn().mockReturnValue({ filename: "test.json" }),
          download: vi.fn().mockResolvedValue({
            content: base64Content,
            filename: "test.json",
            mime_type: "application/json",
          }),
        },
      }

      const result = await readJsonTool.invoke({
        args: { parameters: { file: "some-file-ref" } },
        context: mockContext,
      } as any)

      expect(result).toEqual(jsonData)
    })

    it("should throw on invalid JSON", async () => {
      const base64Content = Buffer.from("not valid json").toString("base64")

      const mockContext = {
        files: {
          parseFileRef: vi.fn().mockReturnValue({ filename: "test.json" }),
          download: vi.fn().mockResolvedValue({
            content: base64Content,
            filename: "test.json",
            mime_type: "application/json",
          }),
        },
      }

      await expect(
        readJsonTool.invoke({
          args: { parameters: { file: "some-file-ref" } },
          context: mockContext,
        } as any),
      ).rejects.toThrow("Failed to parse JSON")
    })
  })
})
