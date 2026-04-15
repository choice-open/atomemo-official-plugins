import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  dingtalkRequest,
  getUserIdByUnionId,
  getAccessToken,
  resetTokenCacheForTests,
  resolveOperatorUserId,
} from "../../src/lib/dingtalk"

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("dingtalk transport", () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    resetTokenCacheForTests()
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("caches access tokens between requests", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ accessToken: "token-1", expireIn: 7200 }),
    )

    const credential = {
      client_id: "client-1",
      client_secret: "secret-1",
    }

    await expect(getAccessToken(credential)).resolves.toBe("token-1")
    await expect(getAccessToken(credential)).resolves.toBe("token-1")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.dingtalk.com/v1.0/oauth2/accessToken",
    )
  })

  it("uses header auth for v1.0 endpoints", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "token-1", expireIn: 7200 }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }))

    await expect(
      dingtalkRequest(
        { client_id: "client-1", client_secret: "secret-1" },
        {
          method: "GET",
          path: "/contact/users/search",
        },
      ),
    ).resolves.toEqual({ ok: true })

    const request = fetchMock.mock.calls[1]?.[1] as RequestInit
    expect(request.headers).toEqual(
      expect.objectContaining({
        "x-acs-dingtalk-access-token": "token-1",
      }),
    )
  })

  it("uses query auth for legacy oapi endpoints", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "token-1", expireIn: 7200 }))
      .mockResolvedValueOnce(jsonResponse({ errcode: 0 }))

    await dingtalkRequest(
      { client_id: "client-1", client_secret: "secret-1" },
      {
        method: "POST",
        url: "https://oapi.dingtalk.com/topapi/v2/user/getbymobile",
        body: { mobile: "13000000000" },
      },
    )

    const url = String(fetchMock.mock.calls[1]?.[0])
    expect(url).toContain("access_token=token-1")
  })

  it("refreshes token once when an API response indicates an invalid token", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "old-token", expireIn: 7200 }))
      .mockResolvedValueOnce(jsonResponse({ message: "access_token invalid" }, 401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: "new-token", expireIn: 7200 }))
      .mockResolvedValueOnce(jsonResponse({ success: true }))

    await expect(
      dingtalkRequest(
        { client_id: "client-1", client_secret: "secret-1" },
        {
          method: "GET",
          path: "/workflow/processInstances",
        },
      ),
    ).resolves.toEqual({ success: true })

    expect(fetchMock).toHaveBeenCalledTimes(4)
    const retryRequest = fetchMock.mock.calls[3]?.[1] as RequestInit
    expect(retryRequest.headers).toEqual(
      expect.objectContaining({
        "x-acs-dingtalk-access-token": "new-token",
      }),
    )
  })

  it("looks up a userId by unionId through the legacy API", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "token-1", expireIn: 7200 }))
      .mockResolvedValueOnce(
        jsonResponse({
          errcode: 0,
          result: { userid: "user-123" },
        }),
      )

    await expect(
      getUserIdByUnionId(
        { client_id: "client-1", client_secret: "secret-1" },
        "union-123",
      ),
    ).resolves.toBe("user-123")

    const url = String(fetchMock.mock.calls[1]?.[0])
    const request = fetchMock.mock.calls[1]?.[1] as RequestInit

    expect(url).toBe(
      "https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=token-1",
    )
    expect(request.body).toBe(JSON.stringify({ unionid: "union-123" }))
  })

  it("caches userId lookups per credential and unionId", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "token-1", expireIn: 7200 }))
      .mockResolvedValueOnce(
        jsonResponse({
          errcode: 0,
          result: { userid: "user-123" },
        }),
      )

    const credential = { client_id: "client-1", client_secret: "secret-1" }

    await expect(getUserIdByUnionId(credential, "union-123")).resolves.toBe(
      "user-123",
    )
    await expect(getUserIdByUnionId(credential, "union-123")).resolves.toBe(
      "user-123",
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("resolves operator userId from the credential default unionId", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ accessToken: "token-1", expireIn: 7200 }))
      .mockResolvedValueOnce(
        jsonResponse({
          errcode: 0,
          result: { userid: "user-123" },
        }),
      )

    await expect(
      resolveOperatorUserId(
        {
          client_id: "client-1",
          client_secret: "secret-1",
          user_union_id: "union-default",
        },
      ),
    ).resolves.toBe("user-123")

    const request = fetchMock.mock.calls[1]?.[1] as RequestInit
    expect(request.body).toBe(JSON.stringify({ unionid: "union-default" }))
  })
})
