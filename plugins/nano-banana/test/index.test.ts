import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"

const generateContentMock = vi.fn()

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addCredential: vi.fn(),
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("@google/genai", () => ({
  ThinkingLevel: {
    HIGH: "HIGH",
    LOW: "LOW",
  },
  GoogleGenAI: class {
    models = {
      generateContent: generateContentMock,
    }
  },
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

vi.mock("../src/tools/generate-image-skill.md", () => ({
  default: "generate image skill",
}))

vi.mock("../src/tools/edit-image-skill.md", () => ({
  default: "edit image skill",
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { geminiApiKeyCredential } from "../src/credentials/gemini-api-key"
import { editImageTool } from "../src/tools/edit-image"
import { generateImageTool } from "../src/tools/generate-image"

type InvokeContext = Parameters<typeof editImageTool.invoke>[0]["context"]
type UploadFile = Parameters<InvokeContext["files"]["upload"]>[0]
type MockedFiles = InvokeContext["files"] & {
  upload: Mock
  download: Mock
  attachRemoteUrl: Mock
  parseFileRef: Mock
}

function createInvokeContext(): InvokeContext & { files: MockedFiles } {
  const files: MockedFiles = {
    upload: vi.fn(async (file: UploadFile) => ({
      ...file,
      source: "oss" as const,
      res_key: "uploaded-key",
    })),
    download: vi.fn(),
    attachRemoteUrl: vi.fn(),
    parseFileRef: vi.fn((file) => {
      if (!file || typeof file !== "object" || (file as { __type__?: unknown }).__type__ !== "file_ref") {
        return file
      }

      const fileRef = file as Record<string, unknown>
      return {
        __type__: "file_ref" as const,
        source: fileRef.source === "mem" ? "mem" : "oss",
        filename:
          typeof fileRef.filename === "string" ? fileRef.filename : null,
        extension:
          typeof fileRef.extension === "string" ? fileRef.extension : null,
        mime_type:
          typeof fileRef.mime_type === "string" ? fileRef.mime_type : null,
        size: typeof fileRef.size === "number" ? fileRef.size : null,
        res_key:
          typeof fileRef.res_key === "string" ? fileRef.res_key : null,
        remote_url:
          typeof fileRef.remote_url === "string" ? fileRef.remote_url : null,
        content:
          typeof fileRef.content === "string" ? fileRef.content : null,
      }
    }),
  }

  return { files }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("nano-banana plugin", () => {
  describe("plugin initialization", () => {
    it("creates a plugin instance with the expected shape", async () => {
      const plugin = await createPlugin({
        name: "nano-banana",
        display_name: { en_US: "Nano Banana Image Studio" },
        description: { en_US: "Nano Banana plugin" },
        icon: "🍌",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/nano-banana",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(plugin.run).toBeDefined()
    })

    it("registers the credential and both tools on import", async () => {
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
      expect(addCredential).toHaveBeenCalledWith(geminiApiKeyCredential)
      expect(addTool).toHaveBeenNthCalledWith(1, generateImageTool)
      expect(addTool).toHaveBeenNthCalledWith(2, editImageTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("generate image tool", () => {
    it("throws when the credential id is missing", async () => {
      await expect(
        generateImageTool.invoke({
          args: {
            parameters: {
              prompt: "draw a banana",
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow("Missing Gemini API key. Please configure the credential.")

      expect(generateContentMock).not.toHaveBeenCalled()
    })

    it("throws when the credential payload is malformed", async () => {
      await expect(
        generateImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "draw a banana",
            },
            credentials: {
              gemini: { api_key: 123 },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow("Missing Gemini API key. Please configure the credential.")

      expect(generateContentMock).not.toHaveBeenCalled()
    })

    it("returns an uploaded file ref when the model generates an image", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                { text: "Generated image" },
                { inlineData: { data: "aGVsbG8=", mimeType: "image/png" } },
              ],
            },
            groundingMetadata: {
              groundingChunks: [{ uri: "https://example.com" }],
            },
          },
        ],
      })

      const context = createInvokeContext()
      const result = await generateImageTool.invoke({
        args: {
          parameters: {
            credentialId: "gemini",
            prompt: "draw a banana",
            model: "gemini-3.1-flash-image-preview",
          },
          credentials: {
            gemini: { api_key: "secret" },
          },
        },
        context,
      })

      expect(generateContentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-3.1-flash-image-preview",
          contents: "draw a banana",
        }),
      )
      expect(context.files.upload).toHaveBeenCalledOnce()
      expect(result).toEqual(
        expect.objectContaining({
          text: "Generated image",
          model: "gemini-3.1-flash-image-preview",
          grounding_sources: [{ uri: "https://example.com" }],
          image: expect.objectContaining({
            __type__: "file_ref",
            source: "oss",
            mime_type: "image/png",
          }),
        }),
      )
    })

    it("returns an in-memory file ref when upload is disabled", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { data: "aGVsbG8=", mimeType: "image/webp" } },
              ],
            },
          },
        ],
      })

      const context = createInvokeContext()
      const result = await generateImageTool.invoke({
        args: {
          parameters: {
            credentialId: "gemini",
            prompt: "draw a banana",
            model: "gemini-3.1-flash-image-preview",
            upload_to_storage: false,
          },
          credentials: {
            gemini: { api_key: "secret" },
          },
        },
        context,
      })

      expect(context.files.upload).not.toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          image: expect.objectContaining({
            __type__: "file_ref",
            source: "mem",
            extension: ".webp",
          }),
        }),
      )
    })

    it("returns text-only output when no image is generated", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [{ text: "Text only response" }],
            },
          },
        ],
      })

      const result = await generateImageTool.invoke({
        args: {
          parameters: {
            credentialId: "gemini",
            prompt: "draw a banana",
            model: "gemini-3.1-flash-image-preview",
          },
          credentials: {
            gemini: { api_key: "secret" },
          },
        },
        context: createInvokeContext(),
      })

      expect(result).toEqual(
        expect.objectContaining({
          text: "Text only response",
          image: null,
        }),
      )
    })

    it("throws when the model response has no content parts", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [{}],
      })

      await expect(
        generateImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "draw a banana",
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow(
        "No content returned from the model. The request may have been blocked by safety filters.",
      )
    })

    it("throws when the model response contains malformed inline image data", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [{ inlineData: { mimeType: "image/png" } }],
            },
          },
        ],
      })

      await expect(
        generateImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "draw a banana",
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow("Invalid response returned from the model.")
    })
  })

  describe("edit image tool", () => {
    it("throws before model invocation when the prompt is missing", async () => {
      await expect(
        editImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "",
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow("Prompt is required.")

      expect(generateContentMock).not.toHaveBeenCalled()
    })

    it("throws before model invocation when the image input is invalid", async () => {
      await expect(
        editImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "edit this image",
              image: null,
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context: createInvokeContext(),
        }),
      ).rejects.toThrow("An input image is required for editing.")

      expect(generateContentMock).not.toHaveBeenCalled()
    })

    it("downloads the source image and reuses the shared invoke flow", async () => {
      generateContentMock.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { data: "aGVsbG8=", mimeType: "image/jpeg" } },
              ],
            },
          },
        ],
      })

      const context = createInvokeContext()
      context.files.download.mockResolvedValueOnce({
        content: "c291cmNlLWltYWdl",
      })

      const result = await editImageTool.invoke({
        args: {
          parameters: {
            credentialId: "gemini",
            prompt: "edit this image",
            image: {
              __type__: "file_ref",
              source: "storage",
              mime_type: "image/png",
            },
            model: "gemini-3.1-flash-image-preview",
          },
          credentials: {
            gemini: { api_key: "secret" },
          },
        },
        context,
      })

      expect(context.files.download).toHaveBeenCalledOnce()
      expect(generateContentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: [
            { text: "edit this image" },
            {
              inlineData: {
                mimeType: "image/png",
                data: "c291cmNlLWltYWdl",
              },
            },
          ],
        }),
      )
      expect(result).toEqual(
        expect.objectContaining({
          image: expect.objectContaining({
            __type__: "file_ref",
            source: "oss",
            extension: ".jpg",
          }),
        }),
      )
    })

    it("throws when the downloaded image payload has no usable content", async () => {
      const context = createInvokeContext()
      context.files.download.mockResolvedValueOnce({})

      await expect(
        editImageTool.invoke({
          args: {
            parameters: {
              credentialId: "gemini",
              prompt: "edit this image",
              image: {
                __type__: "file_ref",
                source: "storage",
                mime_type: "image/png",
              },
            },
            credentials: {
              gemini: { api_key: "secret" },
            },
          },
          context,
        }),
      ).rejects.toThrow("Failed to read the input image content.")

      expect(generateContentMock).not.toHaveBeenCalled()
    })
  })
})
