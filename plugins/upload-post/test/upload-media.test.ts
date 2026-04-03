import { afterEach, describe, expect, it, vi } from "vitest"
import { uploadMediaTool } from "../src/tools/upload-media"

const API_KEY = "test-api-key"
const CREDENTIAL_ID = "cred-1"

function makeArgs(parameters: Record<string, unknown>) {
  return {
    parameters: {
      credentialId: CREDENTIAL_ID,
      user: "user_1",
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

describe("upload_media tool", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns request metadata on successful submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(
          JSON.stringify({
            request_id: "req_123",
            message: "submitted",
            total_platforms: 2,
          }),
        ),
      }),
    )

    const result = await uploadMediaTool.invoke(
      makeInvokeInput({
        media_url: "https://example.com/video.mp4",
        title: "hello",
        platforms: ["tiktok", "youtube"],
        user: "user_1",
      }),
    )

    expect(result).toEqual({
      request_id: "req_123",
      message: "submitted",
      total_platforms: 2,
    })

    expect(fetch).toHaveBeenCalledWith(
      "https://api.upload-post.com/api/upload",
      expect.objectContaining({
        method: "POST",
      }),
    )
  })

  it("returns error when required parameters are missing", async () => {
    await expect(
      uploadMediaTool.invoke(
        makeInvokeInput({
          platforms: ["tiktok"],
        }),
      ),
    ).rejects.toThrow("Parameter `media_url` is required.")
  })

  it("returns error when API returns failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: vi.fn().mockResolvedValue(
          JSON.stringify({
            error: "invalid api key",
          }),
        ),
      }),
    )

    await expect(
      uploadMediaTool.invoke(
        makeInvokeInput({
          media_url: "https://example.com/video.mp4",
          platforms: ["tiktok"],
        }),
      ),
    ).rejects.toThrow("invalid api key")
  })

  it("uses photo upload endpoint when media_type is image", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(
          JSON.stringify({
            request_id: "req_photo_1",
            message: "submitted",
            total_platforms: 1,
          }),
        ),
      }),
    )

    const result = await uploadMediaTool.invoke(
      makeInvokeInput({
        media_url: "https://example.com/image.jpg",
        platforms: ["instagram"],
        media_type: "image",
      }),
    )

    expect(result).toEqual({
      request_id: "req_photo_1",
      message: "submitted",
      total_platforms: 1,
    })

    expect(fetch).toHaveBeenCalledWith(
      "https://api.upload-post.com/api/upload_photos",
      expect.objectContaining({
        method: "POST",
      }),
    )
  })

  it("returns clear error when image upload contains unsupported platforms", async () => {
    await expect(
      uploadMediaTool.invoke(
        makeInvokeInput({
          media_url: "https://example.com/image.jpg",
          platforms: ["youtube"],
          media_type: "image",
        }),
      ),
    ).rejects.toThrow(
      "Image upload does not support: youtube. Remove unsupported platforms or set media_type to video.",
    )
  })

  it("returns error when user is missing", async () => {
    await expect(
      uploadMediaTool.invoke(
        makeInvokeInput({
          user: "",
          media_url: "https://example.com/video.mp4",
          platforms: ["tiktok"],
        }),
      ),
    ).rejects.toThrow("Parameter `user` is required.")
  })
})
