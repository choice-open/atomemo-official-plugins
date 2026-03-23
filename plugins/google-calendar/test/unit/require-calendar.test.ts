import { describe, expect, it, vi } from "vitest"

vi.mock("../../src/lib/calendar-client", () => ({
  createCalendarClient: vi.fn(() => ({ mock: "client" })),
}))

import { requireCalendarClient } from "../../src/lib/require-calendar"

describe("requireCalendarClient", () => {
  it("throws when credentials are missing", () => {
    expect(() => requireCalendarClient(undefined, "key1")).toThrow(
      "Missing Google Calendar credential",
    )
    expect(() => requireCalendarClient({}, "key1")).toThrow(
      "Missing Google Calendar credential",
    )
  })

  it("throws when credential key has no access_token", () => {
    expect(() =>
      requireCalendarClient({ key1: { refresh_token: "x" } }, "key1"),
    ).toThrow("Missing Google Calendar credential")
  })

  it("returns calendar client when credential is valid", () => {
    const cred = {
      access_token: "token",
      refresh_token: "refresh",
      client_id: "cid",
      client_secret: "secret",
    }
    const result = requireCalendarClient({ mycred: cred }, "mycred")
    expect(result).toEqual({ mock: "client" })
  })
})
