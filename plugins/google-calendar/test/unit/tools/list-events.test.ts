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

  it("maps to events.list with API defaults (maxResults 250, singleEvents false)", async () => {
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
      maxResults: 250,
      pageToken: undefined,
      q: undefined,
      timeMin: undefined,
      timeMax: undefined,
      timeZone: undefined,
      iCalUID: undefined,
      singleEvents: false,
      orderBy: undefined,
      showDeleted: undefined,
      showHiddenInvitations: undefined,
      updatedMin: undefined,
      maxAttendees: undefined,
      fields: undefined,
      eventTypes: undefined,
      privateExtendedProperty: undefined,
      sharedExtendedProperty: undefined,
    })
    expect(result).toMatchObject({
      items: [{ id: "1", summary: "Event 1" }],
    })
  })

  it("passes optional query parameters per Calendar API", async () => {
    mockList.mockResolvedValue({ data: { items: [] } })

    await listEventsTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          time_min: "2025-03-01T00:00:00Z",
          time_max: "2025-03-31T23:59:59Z",
          max_results: 100,
          page_token: "abc",
          q: "standup",
          single_events: true,
          order_by: "startTime",
          show_deleted: true,
          time_zone: "Asia/Shanghai",
          i_cal_uid: "uid@google.com",
          max_attendees: 5,
          fields: "items(id,summary)",
          show_hidden_invitations: true,
          updated_min: "2025-03-01T00:00:00Z",
          event_types: "default, workingLocation",
          private_extended_properties: "a=1,b=2",
          shared_extended_properties: "x=y",
        },
      },
    })

    expect(mockList).toHaveBeenCalledWith({
      calendarId: "primary",
      maxResults: 100,
      pageToken: "abc",
      q: "standup",
      timeMin: "2025-03-01T00:00:00Z",
      timeMax: "2025-03-31T23:59:59Z",
      timeZone: "Asia/Shanghai",
      iCalUID: "uid@google.com",
      singleEvents: true,
      orderBy: "startTime",
      showDeleted: true,
      showHiddenInvitations: true,
      updatedMin: "2025-03-01T00:00:00Z",
      maxAttendees: 5,
      fields: "items(id,summary)",
      eventTypes: ["default", "workingLocation"],
      privateExtendedProperty: ["a=1", "b=2"],
      sharedExtendedProperty: ["x=y"],
    })
  })

  it("uses syncToken branch without time/q/iCal filters", async () => {
    mockList.mockResolvedValue({ data: { items: [] } })

    await listEventsTool.invoke({
      args: {
        ...baseArgs,
        parameters: {
          ...baseArgs.parameters,
          sync_token: "sync123",
          max_results: 50,
          page_token: "ptok",
          fields: "items(id)",
          time_zone: "Etc/UTC",
          show_deleted: true,
          single_events: true,
          max_attendees: 10,
          event_types: "default",
          time_min: "2025-01-01T00:00:00Z",
          q: "ignored",
        },
      },
    })

    expect(mockList).toHaveBeenCalledWith({
      calendarId: "primary",
      syncToken: "sync123",
      maxResults: 50,
      pageToken: "ptok",
      fields: "items(id)",
      timeZone: "Etc/UTC",
      showDeleted: true,
      singleEvents: true,
      maxAttendees: 10,
      eventTypes: ["default"],
    })
  })
})
