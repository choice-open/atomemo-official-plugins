import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {} }),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { uploadPostCredential } from "../src/credentials/upload-post"
import { getUploadStatusTool } from "../src/tools/get-upload-status"
import { uploadMediaTool } from "../src/tools/upload-media"

describe("upload-post plugin", () => {
  it("initializes plugin and registers credential/tools", async () => {
    const addCredential = vi.fn()
    const addTool = vi.fn()
    const run = vi.fn()

    const createPluginMock = createPlugin as Mock
    createPluginMock.mockResolvedValueOnce({
      addCredential,
      addTool,
      run,
    })

    await import("../src/index")

    expect(createPluginMock).toHaveBeenCalled()
    expect(addCredential).toHaveBeenCalledWith(uploadPostCredential)
    expect(addTool).toHaveBeenCalledWith(uploadMediaTool)
    expect(addTool).toHaveBeenCalledWith(getUploadStatusTool)
    expect(run).toHaveBeenCalled()
  })

  it("exposes expected metadata for upload_media tool", () => {
    expect(uploadMediaTool).toEqual(
      expect.objectContaining({
        name: "upload_media",
        icon: "📤",
      }),
    )
  })

  it("exposes expected metadata for get_upload_status tool", () => {
    expect(getUploadStatusTool).toEqual(
      expect.objectContaining({
        name: "get_upload_status",
        icon: "📊",
      }),
    )
  })
})
