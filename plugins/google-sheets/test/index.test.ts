import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
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

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { parseReadRowsParams } from "../src/helpers/schemas"
import {
  appendRowsTool,
  batchGetValuesTool,
  clearValuesTool,
  copySheetTool,
  createSpreadsheetTool,
  getSpreadsheetInfoTool,
  readRowsTool,
  updateRowsTool,
} from "../src/tools"

describe("google-sheets plugin", () => {
  describe("plugin initialization", () => {
    it("registers credential, eight tools, and run()", async () => {
      const addCredential = vi.fn()
      const addTool = vi.fn()
      const run = vi.fn()
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addCredential,
        addTool,
        run,
      })

      vi.resetModules()
      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledTimes(1)
      expect(addTool).toHaveBeenCalledTimes(8)
      expect(run).toHaveBeenCalledTimes(1)
    })
  })

  describe("read rows tool definition", () => {
    it("exposes expected tool name and parameters", () => {
      expect(readRowsTool).toEqual(
        expect.objectContaining({
          name: "google-sheets-read-rows",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "spreadsheet_id",
              type: "string",
              required: true,
            }),
          ]),
        }),
      )
    })
  })

  describe("parseReadRowsParams (Zod)", () => {
    it("maps Atomemo parameters to Sheets API field names", () => {
      const out = parseReadRowsParams({
        credential_id: "cred-1",
        spreadsheet_id: "abc123",
        range: "Sheet1!A1:B2",
        major_dimension: "COLUMNS",
        value_render_option: "FORMULA",
      })
      expect(out).toEqual({
        spreadsheetId: "abc123",
        range: "Sheet1!A1:B2",
        majorDimension: "COLUMNS",
        valueRenderOption: "FORMULA",
      })
    })

    it("throws on invalid major_dimension", () => {
      expect(() =>
        parseReadRowsParams({
          credential_id: "c",
          spreadsheet_id: "id",
          range: "A1",
          major_dimension: "INVALID",
        }),
      ).toThrow()
    })
  })

  describe("tool registry", () => {
    it("exports all eight tools with stable names", () => {
      const names = [
        readRowsTool.name,
        updateRowsTool.name,
        appendRowsTool.name,
        clearValuesTool.name,
        createSpreadsheetTool.name,
        getSpreadsheetInfoTool.name,
        copySheetTool.name,
        batchGetValuesTool.name,
      ].sort()
      expect(names).toEqual(
        [
          "google-sheets-append-rows",
          "google-sheets-batch-get-values",
          "google-sheets-clear-values",
          "google-sheets-copy-sheet",
          "google-sheets-create-spreadsheet",
          "google-sheets-get-spreadsheet-info",
          "google-sheets-read-rows",
          "google-sheets-update-rows",
        ].sort(),
      )
    })
  })
})
