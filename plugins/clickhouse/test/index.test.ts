import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock clickhouse-js client
const pingMock = vi.fn()
const queryMock = vi.fn()
const commandMock = vi.fn()
const insertMock = vi.fn()
const closeMock = vi.fn()

vi.mock("@clickhouse/client", () => ({
  createClient: vi.fn(() => ({
    ping: pingMock,
    query: queryMock,
    command: commandMock,
    insert: insertMock,
    close: closeMock,
  })),
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
import {
  clickhouseExecTool,
  clickhouseInsertTool,
  clickhousePingTool,
  clickhouseQueryJsonTool,
} from "../src/tools/clickhouse"
import { clickhouseCredential } from "../src/credentials/clickhouse"

describe("clickhouse plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "clickhouse",
        display_name: { en_US: "ClickHouse Plugin" },
        description: { en_US: "A ClickHouse plugin" },
        icon: "🏠",
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

      // Verify plugin initialization
      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(clickhouseCredential)
      expect(addTool).toHaveBeenCalledWith(clickhousePingTool)
      expect(addTool).toHaveBeenCalledWith(clickhouseQueryJsonTool)
      expect(addTool).toHaveBeenCalledWith(clickhouseExecTool)
      expect(addTool).toHaveBeenCalledWith(clickhouseInsertTool)
      expect(run).toHaveBeenCalled()
    })
  })
})

describe("clickhouse tools", () => {
  beforeEach(() => {
    pingMock.mockReset()
    queryMock.mockReset()
    commandMock.mockReset()
    insertMock.mockReset()
    closeMock.mockReset()
  })

  describe("clickhouse-ping tool", () => {
    it("should have connection credential parameter", () => {
      expect(clickhousePingTool.parameters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "connection",
            type: "credential_id",
            required: true,
          }),
        ]),
      )
    })

    it("should fail with missing credential", async () => {
      const result = await clickhousePingTool.invoke({
        args: { parameters: { connection: "conn-1" } as any },
      })

      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          error: "missing_credential",
        }),
      )
    })

    it("should call ping on client and succeed", async () => {
      pingMock.mockResolvedValueOnce({ success: true })

      const result = await clickhousePingTool.invoke({
        args: {
          parameters: { use_select_mode: false, connection: "conn-1" },
          credentials: {
            "conn-1": {
              url: "http://localhost:8123",
              username: "default",
              password: "",
              database: "default",
            } as any,
          },
        },
      })

      expect(pingMock).toHaveBeenCalledWith({ select: false })
      expect(closeMock).toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })

  describe("clickhouse-query-json tool", () => {
    it("should have query parameter", () => {
      expect(clickhouseQueryJsonTool.parameters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "query",
            type: "string",
            required: true,
          }),
        ]),
      )
    })

    it("should execute query and return rows", async () => {
      const rows = [{ id: 1, name: "foo" }]
      queryMock.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(rows),
      })

      const result = await clickhouseQueryJsonTool.invoke({
        args: {
          parameters: {
            connection: "conn-1",
            query: "SELECT 1",
            max_rows: 10,
          },
          credentials: {
            "conn-1": {
              url: "http://localhost:8123",
            } as any,
          },
        },
      })

      expect(queryMock).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "SELECT 1",
          format: "JSONEachRow",
        }),
      )
      expect(closeMock).toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })

  describe("clickhouse-exec tool", () => {
    it("should execute command", async () => {
      commandMock.mockResolvedValueOnce({})

      const statement = "CREATE TABLE t (id UInt64) ENGINE = Memory"
      const result = await clickhouseExecTool.invoke({
        args: {
          parameters: { connection: "conn-1", statement },
          credentials: {
            "conn-1": {
              url: "http://localhost:8123",
            } as any,
          },
        },
      })

      expect(commandMock).toHaveBeenCalledWith(
        expect.objectContaining({
          query: statement,
        }),
      )
      expect(closeMock).toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })

  describe("clickhouse-insert-rows tool", () => {
    it("should insert rows into table", async () => {
      insertMock.mockResolvedValueOnce({})

      const rows = [
        { id: 1, name: "foo" },
        { id: 2, name: "bar" },
      ]

      const result = await clickhouseInsertTool.invoke({
        args: {
          parameters: {
            connection: "conn-1",
            table: "events",
            rows: JSON.stringify(rows),
          },
          credentials: {
            "conn-1": {
              url: "http://localhost:8123",
            } as any,
          },
        },
      })

      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          table: "events",
          format: "JSONEachRow",
        }),
      )
      expect(closeMock).toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })
})
