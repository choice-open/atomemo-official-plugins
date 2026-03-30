import { beforeEach, describe, expect, it, vi } from "vitest"
import { normalizeMappedFieldValue, resolveFields } from "./resolve"

const { getBaseSchemaMock } = vi.hoisted(() => ({
  getBaseSchemaMock: vi.fn(),
}))

vi.mock("../../api/client", async () => {
  const actual =
    await vi.importActual<typeof import("../../api/client")>("../../api/client")

  return {
    ...actual,
    getBaseSchema: getBaseSchemaMock,
  }
})

describe("resolveFields", () => {
  beforeEach(() => {
    getBaseSchemaMock.mockReset()
  })

  it("skips schema lookups and leaves values untouched when typecast is false", async () => {
    const fields = await resolveFields(
      {
        fields: {
          Amount: "123",
          Assignee: '{"id":"usr123"}',
        },
      },
      "token",
      "appBase",
      "Tasks",
      false,
    )

    expect(getBaseSchemaMock).not.toHaveBeenCalled()
    expect(fields).toEqual({
      Amount: "123",
      Assignee: '{"id":"usr123"}',
    })
  })

  it("uses mapping types before Airtable-specific normalization when typecast is true", async () => {
    getBaseSchemaMock.mockResolvedValue([
      {
        id: "tblTasks",
        name: "Tasks",
        primaryFieldId: "fldPrimary",
        fields: [
          { id: "fldAmount", name: "Amount", type: "number" },
          { id: "fldDone", name: "Done", type: "checkbox" },
          { id: "fldAssignee", name: "Assignee", type: "singleCollaborator" },
          { id: "fldLinks", name: "Links", type: "multipleRecordLinks" },
          { id: "fldBarcode", name: "Barcode", type: "barcode" },
        ],
      },
    ])

    const fields = await resolveFields(
      {
        fields: {
          Amount: "123.5",
          Done: "yes",
          Assignee: '{"id":"usr123"}',
          Links: '[{"id":"rec123"},{"id":"rec456"}]',
          Barcode: '{"text":"123456789012","type":"code128"}',
        },
      },
      "token",
      "appBase",
      "Tasks",
      true,
    )

    expect(fields).toEqual({
      Amount: 123.5,
      Done: true,
      Assignee: { id: "usr123" },
      Links: ["rec123", "rec456"],
      Barcode: { text: "123456789012", type: "code128" },
    })
  })

  it("only casts whole numbers for generic integer mapping types", () => {
    expect(normalizeMappedFieldValue("integer", "5")).toBe(5)
    expect(normalizeMappedFieldValue("integer", "5.2")).toBe("5.2")
  })
})
