import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { describe, expect, it, type Mock, vi } from "vitest"
import { googleDocsOAuth2Credential } from "../src/credentials/google-docs-oauth2"
import { batchUpdateDocumentTool } from "../src/tools/docs/batch-update-document"
import { createDocumentTool } from "../src/tools/docs/create-document"
import { getDocumentTool } from "../src/tools/docs/get-document"

const docsCreateMock = vi.fn()
const docsGetMock = vi.fn()
const docsBatchUpdateMock = vi.fn()

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("@googleapis/docs", () => ({
  docs: vi.fn(() => ({
    documents: {
      create: docsCreateMock,
      get: docsGetMock,
      batchUpdate: docsBatchUpdateMock,
    },
  })),
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

vi.mock("../src/tools/demo", () => ({
  demoTool: {
    name: "demo-tool",
  },
}))

describe("google docs plugin", () => {
  it("should register docs credential and tools", async () => {
    const addTool = vi.fn()
    const addCredential = vi.fn()
    const run = vi.fn()

    const createPluginMock = createPlugin as Mock
    createPluginMock.mockResolvedValueOnce({
      addTool,
      addCredential,
      run,
    })

    await import("../src/index")

    expect(createPluginMock).toHaveBeenCalled()
    expect(addCredential).toHaveBeenCalledWith(googleDocsOAuth2Credential)
    expect(addTool).toHaveBeenCalledWith(createDocumentTool)
    expect(addTool).toHaveBeenCalledWith(getDocumentTool)
    expect(addTool).toHaveBeenCalledWith(batchUpdateDocumentTool)
    expect(run).toHaveBeenCalled()
  })

  it("create-document should call docs api", async () => {
    docsCreateMock.mockResolvedValueOnce({
      data: {
        documentId: "doc_1",
        title: "Doc Title",
      },
    })

    const result = await createDocumentTool.invoke({
      args: {
        parameters: {
          google_credential: "google_credential",
          title: "Doc Title",
        },
        credentials: {
          google_credential: {
            access_token: "token",
            client_id: "id",
            client_secret: "secret",
          },
        },
      },
    } as any)

    expect(docsCreateMock).toHaveBeenCalled()
    expect(result).toEqual(
      expect.objectContaining({
        documentId: "doc_1",
        title: "Doc Title",
      }),
    )
  })

  it("batch-update-document should support structured insert_text operation", async () => {
    docsBatchUpdateMock.mockResolvedValueOnce({
      data: {
        documentId: "doc_1",
      },
    })

    const result = await batchUpdateDocumentTool.invoke({
      args: {
        parameters: {
          google_credential: "google_credential",
          document_id: "doc_1",
          operation: "insert_text",
          insert_text: "Hello",
          insert_index: 1,
        },
        credentials: {
          google_credential: {
            access_token: "token",
            client_id: "id",
            client_secret: "secret",
          },
        },
      },
    } as any)

    expect(docsBatchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: "doc_1",
        requestBody: {
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: "Hello",
              },
            },
          ],
          writeControl: undefined,
        },
      }),
    )
    expect(result).toEqual(expect.objectContaining({ documentId: "doc_1" }))
  })
})
