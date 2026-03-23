import { describe, expect, it, vi } from "vitest"

const mockList = vi.fn()
vi.mock("../../../src/lib/require-calendar", () => ({
  requireCalendarClient: vi.fn(() => ({
    events: { list: mockList },
  })),
}))

vi.mock("../../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key, zh_Hans: key })),
}))

import { listEventsTool } from "../../../src/tools/event/list-events"

describe("list-events tool", () => {
  const baseArgs = {
    credentials: { cred1: { access_token: "token" } },
    parameters: {
      credential_id: "cred1",
      calendar_id: "primary",
    },
  }

  beforeEach(() => {
    mockList.mockReset()
  })

  it("lists events with default parameters", async () => {
    mockList.mockResolvedValue({
      data: {
        items: [{ id: "1", summary: "Event 1" }],
        nextPageToken: undefined,
      },
    })

    const result = await listEventsTool.invoke({
      args: { ...baseArgs, parameters: { ...baseArgs.parameters } },
    })

    expect(mockList).toHaveBeenCalledWith({
      calendarId: "primary",
      timeMin: undefined,
      timeMax: undefined,
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    })
    expect(result).toMatchObject({
      items: [{ id: "1", summary: "Event 1" }],
    })
  })

  it("passes time range and max_results when provided", async () => {
    mockList.mockResolvedValue({ data: { items: [] } })

    await listEventsTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          time_min: "2025-03-01T00:00:00Z",
          time_max: "2025-03-31T23:59:59Z",
          max_results: 50,
        },
      },
    })

    expect(mockList).toHaveBeenCalledWith({
      calendarId: "primary",
      timeMin: "2025-03-01T00:00:00Z",
      timeMax: "2025-03-31T23:59:59Z",
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    })
  })
})
