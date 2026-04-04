import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

import { createCalendarEventTool } from "../../src/tools/create-calendar-event"

describe("createCalendarEventTool", () => {
  it("should define expected name and parameters", () => {
    expect(createCalendarEventTool.name).toBe("create-calendar-event")
    const names = createCalendarEventTool.parameters.map((p) => p.name)
    expect(names).toEqual([
      "credential_id",
      "subject",
      "start_datetime",
      "end_datetime",
      "time_zone",
      "location",
      "teams_online_meeting",
      "attendees",
      "body",
    ])
  })

  describe("invoke", () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
      mockFetch.mockClear()
      vi.stubGlobal("fetch", mockFetch)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it("should POST /me/events with Bearer token and return event fields", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "evt-1",
          subject: "Sync",
          webLink: "https://outlook.office365.com/...",
          start: { dateTime: "2025-04-03T14:00:00", timeZone: "UTC" },
          end: { dateTime: "2025-04-03T15:00:00", timeZone: "UTC" },
        }),
      })

      const result = await createCalendarEventTool.invoke({
        args: {
          parameters: {
            subject: "Sync",
            start_datetime: "2025-04-03T14:00:00",
            end_datetime: "2025-04-03T15:00:00",
            time_zone: "UTC",
            body: "Agenda",
            location: "Room A",
            credential_id: "cred-1",
          },
          credentials: {
            "cred-1": { access_token: "tok" },
          },
        },
      } as never)

      expect(result).toEqual(
        expect.objectContaining({
          id: "evt-1",
          subject: "Sync",
          webLink: "https://outlook.office365.com/...",
        }),
      )

      const [url, init] = mockFetch.mock.calls[0]
      expect(url).toBe("https://graph.microsoft.com/v1.0/me/events")
      expect(init?.method).toBe("POST")
      expect(init?.headers).toMatchObject({
        authorization: "Bearer tok",
        "content-type": "application/json",
      })
      const body = JSON.parse(String(init?.body))
      expect(body).toEqual({
        subject: "Sync",
        start: {
          dateTime: "2025-04-03T14:00:00",
          timeZone: "UTC",
        },
        end: {
          dateTime: "2025-04-03T15:00:00",
          timeZone: "UTC",
        },
        body: { contentType: "text", content: "Agenda" },
        location: { displayName: "Room A" },
      })
    })

    it("should default time zone to UTC when empty", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "evt-2",
          subject: "A",
        }),
      })

      await createCalendarEventTool.invoke({
        args: {
          parameters: {
            subject: "A",
            start_datetime: "2025-04-03T14:00:00",
            end_datetime: "2025-04-03T15:00:00",
            credential_id: "c",
          },
          credentials: { c: { access_token: "t" } },
        },
      } as never)

      const body = JSON.parse(String(mockFetch.mock.calls[0][1]?.body))
      expect(body.start.timeZone).toBe("UTC")
      expect(body.end.timeZone).toBe("UTC")
    })

    it("should throw without access_token", async () => {
      await expect(
        createCalendarEventTool.invoke({
          args: {
            parameters: {
              subject: "A",
              start_datetime: "2025-04-03T14:00:00",
              end_datetime: "2025-04-03T15:00:00",
              credential_id: "c",
            },
            credentials: { c: {} },
          },
        } as never),
      ).rejects.toThrow("access_token")
    })

    it("should add Teams and attendees when requested", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "evt-teams",
          onlineMeeting: {
            joinUrl: "https://teams.microsoft.com/l/meetup-join/...",
          },
        }),
      })

      await createCalendarEventTool.invoke({
        args: {
          parameters: {
            subject: "Sync",
            start_datetime: "2025-04-03T14:00:00",
            end_datetime: "2025-04-03T15:00:00",
            time_zone: "UTC",
            teams_online_meeting: true,
            attendees: "ada@contoso.com; bob@contoso.com",
            credential_id: "cred-1",
          },
          credentials: {
            "cred-1": { access_token: "tok" },
          },
        },
      } as never)

      const body = JSON.parse(String(mockFetch.mock.calls[0][1]?.body))
      expect(body.isOnlineMeeting).toBe(true)
      expect(body.onlineMeetingProvider).toBe("teamsForBusiness")
      expect(body.attendees).toEqual([
        {
          emailAddress: { address: "ada@contoso.com" },
          type: "required",
        },
        {
          emailAddress: { address: "bob@contoso.com" },
          type: "required",
        },
      ])
    })

    it("should throw on Graph error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: { message: "Start time must be before end time" },
        }),
      })

      await expect(
        createCalendarEventTool.invoke({
          args: {
            parameters: {
              subject: "A",
              start_datetime: "2025-04-03T15:00:00",
              end_datetime: "2025-04-03T14:00:00",
              credential_id: "c",
            },
            credentials: { c: { access_token: "t" } },
          },
        } as never),
      ).rejects.toThrow("Start time must be before end time")
    })
  })
})
