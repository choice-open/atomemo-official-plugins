import { describe, expect, it, vi } from "vitest"

const mockInsert = vi.fn()
vi.mock("../../../src/lib/require-calendar", () => ({
  requireCalendarClient: vi.fn(() => ({
    events: {
      insert: mockInsert,
    },
  })),
}))

vi.mock("../../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key, zh_Hans: key })),
}))

import { createEventTool } from "../../../src/tools/event/create-event"

describe("create-event tool", () => {
  const baseArgs = {
    credentials: { cred1: { access_token: "token" } },
    parameters: {
      credential_id: "cred1",
      calendar_id: "primary",
    },
  }

  beforeEach(() => {
    mockInsert.mockReset()
  })

  it("creates timed event with correct request body", async () => {
    mockInsert.mockResolvedValue({
      data: {
        id: "evt123",
        summary: "Meeting",
        start: { dateTime: "2025-03-23T10:00:00+08:00" },
        end: { dateTime: "2025-03-23T11:00:00+08:00" },
      },
    })

    const result = await createEventTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          summary: "Meeting",
          is_all_day_event: false,
          start_datetime: "2025-03-23T10:00:00+08:00",
          end_datetime: "2025-03-23T11:00:00+08:00",
        },
      },
    })

    expect(mockInsert).toHaveBeenCalledWith({
      calendarId: "primary",
      requestBody: {
        summary: "Meeting",
        start: { dateTime: "2025-03-23T10:00:00+08:00", timeZone: "UTC" },
        end: { dateTime: "2025-03-23T11:00:00+08:00", timeZone: "UTC" },
      },
    })
    expect(result).toMatchObject({
      id: "evt123",
      summary: "Meeting",
    })
  })

  it("creates all-day event with date format", async () => {
    mockInsert.mockResolvedValue({
      data: { id: "evt456", summary: "Holiday", start: { date: "2025-03-23" } },
    })

    await createEventTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          summary: "Holiday",
          is_all_day_event: true,
          start_date: "2025-03-23",
          end_date: "2025-03-24",
        },
      },
    })

    expect(mockInsert).toHaveBeenCalledWith({
      calendarId: "primary",
      requestBody: {
        summary: "Holiday",
        start: { date: "2025-03-23" },
        end: { date: "2025-03-24" },
      },
    })
  })

  it("includes description and location when provided", async () => {
    mockInsert.mockResolvedValue({ data: {} })

    await createEventTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          summary: "Team Sync",
          is_all_day_event: false,
          start_datetime: "2025-03-23T14:00:00Z",
          end_datetime: "2025-03-23T15:00:00Z",
          description: "Weekly sync",
          location: "Room A",
          timezone: "Asia/Shanghai",
        },
      },
    })

    expect(mockInsert).toHaveBeenCalledWith({
      calendarId: "primary",
      requestBody: {
        summary: "Team Sync",
        description: "Weekly sync",
        location: "Room A",
        start: { dateTime: "2025-03-23T14:00:00Z", timeZone: "Asia/Shanghai" },
        end: { dateTime: "2025-03-23T15:00:00Z", timeZone: "Asia/Shanghai" },
      },
    })
  })

  it("throws when all-day event missing start_date or end_date", async () => {
    await expect(
      createEventTool.invoke({
        args: {
          ...baseArgs,
          parameters: {
            ...baseArgs.parameters,
            summary: "Event",
            is_all_day_event: true,
            start_date: "",
            end_date: "2025-03-24",
          },
        },
      }),
    ).rejects.toThrow("Start date and end date are required for all-day events")

    await expect(
      createEventTool.invoke({
        args: {
          ...baseArgs,
          parameters: {
            ...baseArgs.parameters,
            summary: "Event",
            is_all_day_event: true,
            start_date: "2025-03-23",
            end_date: "",
          },
        },
      }),
    ).rejects.toThrow("Start date and end date are required for all-day events")
  })

  it("throws when timed event missing start_datetime or end_datetime", async () => {
    await expect(
      createEventTool.invoke({
        args: {
          ...baseArgs,
          parameters: {
            ...baseArgs.parameters,
            summary: "Event",
            is_all_day_event: false,
            start_datetime: "",
            end_datetime: "2025-03-23T11:00:00Z",
          },
        },
      }),
    ).rejects.toThrow("Start time and end time are required for timed events")
  })
})
