import { describe, expect, it, vi } from "vitest"

const mockQuery = vi.fn()
vi.mock("../../../src/lib/require-calendar", () => ({
  requireCalendarClient: vi.fn(() => ({
    freebusy: { query: mockQuery },
  })),
}))

vi.mock("../../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key, zh_Hans: key })),
}))

import { queryFreebusyTool } from "../../../src/tools/freebusy/query-freebusy"

describe("query-freebusy tool", () => {
  const baseArgs = {
    credentials: { cred1: { access_token: "token" } },
    parameters: {
      credential_id: "cred1",
      time_min: "2025-03-23T00:00:00Z",
      time_max: "2025-03-23T23:59:59Z",
      calendar_ids: "primary,user@example.com",
    },
  }

  beforeEach(() => {
    mockQuery.mockReset()
  })

  it("queries freebusy for multiple calendars", async () => {
    mockQuery.mockResolvedValue({
      data: {
        calendars: {
          primary: {
            busy: [
              { start: "2025-03-23T10:00:00Z", end: "2025-03-23T11:00:00Z" },
            ],
          },
          "user@example.com": { busy: [] },
        },
      },
    })

    const result = await queryFreebusyTool.invoke({
      args: { ...baseArgs },
    })

    expect(mockQuery).toHaveBeenCalledWith({
      requestBody: {
        timeMin: "2025-03-23T00:00:00Z",
        timeMax: "2025-03-23T23:59:59Z",
        items: [{ id: "primary" }, { id: "user@example.com" }],
      },
    })
    expect(result).toMatchObject({
      calendars: {
        primary: {
          busy: [
            { start: "2025-03-23T10:00:00Z", end: "2025-03-23T11:00:00Z" },
          ],
        },
        "user@example.com": { busy: [] },
      },
    })
  })

  it("trims and filters empty calendar IDs", async () => {
    mockQuery.mockResolvedValue({ data: { calendars: {} } })

    await queryFreebusyTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          calendar_ids: " primary , , user@test.com ",
        },
      },
    })

    expect(mockQuery).toHaveBeenCalledWith({
      requestBody: {
        timeMin: "2025-03-23T00:00:00Z",
        timeMax: "2025-03-23T23:59:59Z",
        items: [{ id: "primary" }, { id: "user@test.com" }],
      },
    })
  })
})
