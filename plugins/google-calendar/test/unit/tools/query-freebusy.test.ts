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
      items: "primary,user@example.com",
    },
  }

  beforeEach(() => {
    mockQuery.mockReset()
  })

  it("maps to freeBusy.query request body (timeMin, timeMax, items)", async () => {
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

  it("trims item ids and ignores empty segments", async () => {
    mockQuery.mockResolvedValue({ data: { calendars: {} } })

    await queryFreebusyTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          items: " primary , , user@test.com ",
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

  it("passes timeZone and expansion limits per API", async () => {
    mockQuery.mockResolvedValue({ data: { calendars: {} } })

    await queryFreebusyTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          time_zone: "Europe/Berlin",
          group_expansion_max: 50,
          calendar_expansion_max: 25,
        },
      },
    })

    expect(mockQuery).toHaveBeenCalledWith({
      requestBody: {
        timeMin: "2025-03-23T00:00:00Z",
        timeMax: "2025-03-23T23:59:59Z",
        timeZone: "Europe/Berlin",
        groupExpansionMax: 50,
        calendarExpansionMax: 25,
        items: [{ id: "primary" }, { id: "user@example.com" }],
      },
    })
  })

  it("omits out-of-range expansion integers", async () => {
    mockQuery.mockResolvedValue({ data: { calendars: {} } })

    await queryFreebusyTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          group_expansion_max: 101,
          calendar_expansion_max: 0,
        },
      },
    })

    expect(mockQuery).toHaveBeenCalledWith({
      requestBody: {
        timeMin: "2025-03-23T00:00:00Z",
        timeMax: "2025-03-23T23:59:59Z",
        items: [{ id: "primary" }, { id: "user@example.com" }],
      },
    })
  })

  it("throws when items resolves to no ids", async () => {
    await expect(
      queryFreebusyTool.invoke({
        args: {
          ...baseArgs,
          parameters: {
            ...baseArgs.parameters,
            items: " , , ",
          },
        },
      }),
    ).rejects.toThrow("items must contain at least one")
  })
})
