import { afterEach, describe, expect, mock, test } from "bun:test"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeTikHubApi,
  parseTikHubJsonResponse,
  sanitizeJsonValue,
} from "./request"

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe("sanitizeJsonValue", () => {
  test("recursively removes NUL characters from string values", () => {
    const input = {
      data: {
        mixFeeds: [
          {
            feed: {
              bottomEntryInfo: {
                eventTrackData: { is_hotbar: "\u0000" },
              },
            },
          },
          { text: "before\u0000middle\u0000after" },
        ],
      },
      unchanged: [null, true, 42],
    } as JsonValue

    expect(sanitizeJsonValue(input)).toEqual({
      data: {
        mixFeeds: [
          {
            feed: {
              bottomEntryInfo: {
                eventTrackData: { is_hotbar: "" },
              },
            },
          },
          { text: "beforemiddleafter" },
        ],
      },
      unchanged: [null, true, 42],
    })
  })

  test("preserves other JSON-compatible control characters", () => {
    expect(sanitizeJsonValue("line 1\nline 2\tvalue\u0001")).toBe(
      "line 1\nline 2\tvalue\u0001",
    )
  })
})

describe("invokeTikHubApi", () => {
  test("sanitizes NUL decoded by response.json before returning output", async () => {
    const responseText =
      '{"data":{"data":{"mixFeeds":[{"feed":{"bottomEntryInfo":{"eventTrackData":{"is_hotbar":"\\u0000"}}}}]}}}'
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(responseText, {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    ) as unknown as typeof fetch

    const output = await invokeTikHubApi(
      {
        id: "kuaishou_app_search_video_v2",
        method: "GET",
        path: "/api/v1/kuaishou/app/search_video_v2",
      },
      {
        credentials: { test: { api_key: "mock-key" } },
        credentialId: "test",
        queryParams: { keyword: "AI" },
      },
    )

    expect(output).toEqual({
      data: {
        data: {
          mixFeeds: [
            {
              feed: {
                bottomEntryInfo: {
                  eventTrackData: { is_hotbar: "" },
                },
              },
            },
          ],
        },
      },
    })
    expect(JSON.stringify(output)).not.toContain("\\u0000")
  })

  test("removes raw NUL before parsing the response body", async () => {
    const responseText =
      '{"data":{"data":{"mixFeeds":[{"feed":{"bottomEntryInfo":{"eventTrackData":{"is_hotbar":"\u0000"}}}}]}}}'
    expect(() => JSON.parse(responseText)).toThrow()
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(responseText, {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    ) as unknown as typeof fetch

    const output = await invokeTikHubApi(
      {
        id: "kuaishou_app_search_video_v2",
        method: "GET",
        path: "/api/v1/kuaishou/app/search_video_v2",
      },
      {
        credentials: { test: { api_key: "mock-key" } },
        credentialId: "test",
        queryParams: { keyword: "AI" },
      },
    )

    expect(output).toEqual({
      data: {
        data: {
          mixFeeds: [
            {
              feed: {
                bottomEntryInfo: {
                  eventTrackData: { is_hotbar: "" },
                },
              },
            },
          ],
        },
      },
    })
  })
})

describe("parseTikHubJsonResponse", () => {
  test("handles raw and escaped NUL forms in one response", () => {
    const responseText = '{"raw":"\u0000","escaped":"\\u0000"}'

    expect(parseTikHubJsonResponse(responseText)).toEqual({
      raw: "",
      escaped: "",
    })
  })
})
