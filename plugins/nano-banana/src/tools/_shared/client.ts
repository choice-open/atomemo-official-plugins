import type { FileRef, JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  GoogleGenAI,
  ThinkingLevel,
} from "@google/genai"
import type {
  GenerateContentConfig,
  GroundingChunk,
  Part,
} from "@google/genai"
import {
  GEMINI_3_1_FLASH_IMAGE_PREVIEW,
  GEMINI_3_PRO_IMAGE_PREVIEW,
} from "./constants"
import {
  credentialSchema,
  credentialIdParametersSchema,
  credentialsSchema,
  downloadedFileSchema,
  generateConfigParametersSchema,
  parseWithSchema,
} from "./validation"

export interface ToolArgs {
  parameters: Record<string, unknown>
  credentials?: Record<string, Record<string, unknown>>
}

export interface ToolContext {
  files: {
    upload(
      file: Record<string, unknown>,
      options: Record<string, unknown>,
    ): Promise<unknown>
    download(file: Record<string, unknown>): Promise<unknown>
  }
}

export function getCredential(args: ToolArgs) {
  const { credentialId } = parseWithSchema(
    credentialIdParametersSchema,
    args.parameters,
    "Missing Gemini API key. Please configure the credential.",
  )
  const credentials = parseWithSchema(
    credentialsSchema,
    args.credentials ?? {},
    "Missing Gemini API key. Please configure the credential.",
  )
  const credential = credentials[credentialId ?? ""]
  if (!credential) {
    throw new Error("Missing Gemini API key. Please configure the credential.")
  }

  return parseWithSchema(
    credentialSchema,
    credential,
    "Missing Gemini API key. Please configure the credential.",
  )
}

export function createClient(args: ToolArgs): GoogleGenAI {
  const credential = getCredential(args)
  return new GoogleGenAI({
    apiKey: credential.api_key,
    httpOptions: credential.base_url?.trim() ? {
      baseUrl: credential.base_url.trim(),
    } : undefined,
  })
}

export async function downloadFileContent(
  context: ToolContext,
  fileRef: FileRef,
): Promise<string | null> {
  const downloaded = parseWithSchema(
    downloadedFileSchema,
    await context.files.download(fileRef),
    "Failed to read the input image content.",
  )
  return downloaded.content ?? null
}

export interface GenerateConfig {
  model: string
  aspectRatio?: string
  resolution?: string
  thinkingLevel?: string
  includeThoughts?: boolean
  enableSearch?: boolean
  uploadToStorage: boolean
}

const BASE_ASPECT_RATIOS = new Set([
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
])

const FLASH_IMAGE_EXTRA_ASPECT_RATIOS = new Set(["1:4", "4:1", "1:8", "8:1"])
const GEMINI_3_IMAGE_RESOLUTIONS = new Set(["1K", "2K", "4K"])

function supportsAspectRatio(model: string, aspectRatio?: string): boolean {
  if (!aspectRatio) {
    return false
  }

  if (BASE_ASPECT_RATIOS.has(aspectRatio)) {
    return true
  }

  return (
    model === GEMINI_3_1_FLASH_IMAGE_PREVIEW &&
    FLASH_IMAGE_EXTRA_ASPECT_RATIOS.has(aspectRatio)
  )
}

function supportsResolution(model: string, resolution?: string): boolean {
  if (!resolution) {
    return false
  }

  if (model === GEMINI_3_1_FLASH_IMAGE_PREVIEW) {
    return resolution === "512" || GEMINI_3_IMAGE_RESOLUTIONS.has(resolution)
  }

  if (model === GEMINI_3_PRO_IMAGE_PREVIEW) {
    return GEMINI_3_IMAGE_RESOLUTIONS.has(resolution)
  }

  return false
}

function supportsThinking(model: string): boolean {
  return model === GEMINI_3_1_FLASH_IMAGE_PREVIEW
}

function supportsSearchGrounding(model: string): boolean {
  return model === GEMINI_3_1_FLASH_IMAGE_PREVIEW || model === GEMINI_3_PRO_IMAGE_PREVIEW
}

export function buildGenerateConfig(
  params: Record<string, unknown>,
): GenerateConfig {
  const parsed = parseWithSchema(
    generateConfigParametersSchema,
    params,
    "Invalid image generation parameters.",
  )
  return {
    model: parsed.model || GEMINI_3_1_FLASH_IMAGE_PREVIEW,
    aspectRatio: parsed.aspect_ratio ?? undefined,
    resolution: parsed.resolution ?? undefined,
    thinkingLevel: parsed.thinking_level ?? undefined,
    includeThoughts: parsed.include_thoughts ?? undefined,
    enableSearch: parsed.enable_search_grounding ?? undefined,
    uploadToStorage: parsed.upload_to_storage !== false,
  }
}

export function buildRequestConfig(
  config: GenerateConfig,
): GenerateContentConfig {
  const imageConfig = {
    ...(supportsAspectRatio(config.model, config.aspectRatio) && {
      aspectRatio: config.aspectRatio,
    }),
    ...(supportsResolution(config.model, config.resolution) && {
      imageSize: config.resolution,
    }),
  }

  const requestConfig: GenerateContentConfig = {
    responseModalities: ["TEXT", "IMAGE"],
    ...(Object.keys(imageConfig).length > 0 && { imageConfig }),
  }

  if (supportsThinking(config.model)) {
    requestConfig.thinkingConfig = {
      thinkingLevel: config.thinkingLevel === "high" ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL,
      includeThoughts: config.includeThoughts,
    }
  }

  if (config.enableSearch && supportsSearchGrounding(config.model)) {
    requestConfig.tools = [{ googleSearch: {} }]
  }

  return requestConfig
}

export interface ImageResult {
  text: string | null
  thoughts: string | null
  imageData: string | null
  imageMimeType: string | null
  groundingSources: GroundingChunk[] | null
}

function hasInlineImagePart(parts: Part[]): boolean {
  return parts.some((part) => Boolean(part.inlineData))
}

function appendPartText(current: string | null, part: Part): string | null {
  return part.text ? (current || "") + part.text : current
}

export function mimeToExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
  }
  return map[mimeType] || ".png"
}

export interface InvokeImageToolOptions {
  args: ToolArgs
  context: ToolContext
  contents: string | Record<string, unknown>[]
  filenamePrefix: string
}

export async function invokeImageTool({
  args,
  context,
  contents,
  filenamePrefix,
}: InvokeImageToolOptions): Promise<JsonValue> {
  const client = createClient(args)
  const config = buildGenerateConfig(args.parameters)
  const response = await client.models.generateContent({
    model: config.model,
    contents,
    config: buildRequestConfig(config),
  })

  const candidate = response.candidates?.[0]
  const parts = candidate?.content?.parts
  if (!parts) {
    throw new Error(
      "No content returned from the model. The request may have been blocked by safety filters.",
    )
  }

  const result: ImageResult = {
    text: null,
    thoughts: null,
    imageData: null,
    imageMimeType: null,
    groundingSources: candidate?.groundingMetadata?.groundingChunks || null,
  }

  for (const part of parts) {
    if (part.thought) {
      if (config.includeThoughts) {
        result.thoughts = appendPartText(result.thoughts, part)
      }
      continue
    }

    result.text = appendPartText(result.text, part)
    if (part.inlineData?.data) {
      result.imageData = part.inlineData.data
      result.imageMimeType = part.inlineData.mimeType || null
    }
  }

  if (hasInlineImagePart(parts) && !result.imageData) {
    throw new Error("Invalid response returned from the model.")
  }

  if (!result.imageData) {
    return {
      text:
        result.text || "No image was generated. The model returned text only.",
      thoughts: result.thoughts,
      image: null,
      model: config.model,
      grounding_sources: result.groundingSources as JsonValue,
    }
  }

  const extension = mimeToExtension(result.imageMimeType || "image/png")
  const filename = `${filenamePrefix}${Date.now()}${extension}`

  let imageFileRef: FileRef = {
    __type__: "file_ref",
    source: "mem",
    filename,
    extension,
    mime_type: result.imageMimeType || "image/png",
    size: Math.ceil((result.imageData.length * 3) / 4),
    content: result.imageData,
    res_key: null,
    remote_url: null,
  }

  if (config.uploadToStorage) {
    imageFileRef = await context.files.upload(imageFileRef, {}) as FileRef
  }

  return {
    text: result.text,
    thoughts: result.thoughts,
    image: imageFileRef,
    model: config.model,
    grounding_sources: result.groundingSources as JsonValue,
  }
}
