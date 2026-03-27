import { afterEach, describe, expect, it, vi } from "vitest"
import { getUploadStatusTool } from "../src/tools/get-upload-status"

const API_KEY = "test-api-key"
const CREDENTIAL_ID = "cred-1"

function makeArgs(parameters: Record<string, unknown>) {
  return {
    parameters: {
      credentialId: CREDENTIAL_ID,
      ...parameters,
    },
    credentials: {
      [CREDENTIAL_ID]: {
        api_key: API_KEY,
      },
    },
  }
}

function makeInvokeInput(parameters: Record<string, unknown>) {
  return {
    args: makeArgs(parameters),
    context: {
      files: {},
    },
  } as never
}

describe("get_upload_status tool", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns status payload on successful query", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi
          .fn()
          .mockResolvedValue(JSON.stringify({ request_id: "req_1", status: "done" })),
      }),
    )

    const result = await getUploadStatusTool.invoke(
      makeInvokeInput({ request_id: "req_1" }),
    )

    expect(result).toEqual({ request_id: "req_1", status: "done" })
    expect(fetch).toHaveBeenCalledWith(
      "https://api.upload-post.com/api/uploadposts/status?request_id=req_1",
      expect.objectContaining({
        method: "GET",
      }),
    )
  })

  it("returns error when request_id is missing", async () => {
    await expect(getUploadStatusTool.invoke(makeInvokeInput({}))).rejects.toThrow(
      "Parameter `request_id` is required.",
    )
  })

  it("returns error when API returns failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue(JSON.stringify({ error: "not found" })),
      }),
    )

    await expect(
      getUploadStatusTool.invoke(makeInvokeInput({ request_id: "missing" })),
    ).rejects.toThrow("not found")
  })
})
