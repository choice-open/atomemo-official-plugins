import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

function detectBomEncoding(bytes: Uint8Array): {
  encoding: string
  bomLength: number
} {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xfe &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x00
  ) {
    return { encoding: "utf-32le", bomLength: 4 }
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0xfe &&
    bytes[3] === 0xff
  ) {
    return { encoding: "utf-32be", bomLength: 4 }
  }
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return { encoding: "utf-8", bomLength: 3 }
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { encoding: "utf-16le", bomLength: 2 }
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return { encoding: "utf-16be", bomLength: 2 }
  }
  return { encoding: "utf-8", bomLength: 0 }
}

export const readJsonTool = {
  name: "read-json",
  display_name: t("READ_JSON_TOOL_DISPLAY_NAME"),
  description: t("READ_JSON_TOOL_DESCRIPTION"),
  icon: "https://server-media-public.atomemo.ai/icons/json-reader.svg",
  parameters: [
    {
      name: "file",
      type: "file_ref",
      required: true,
      display_name: t("FILE_DISPLAY_NAME"),
      ui: {
        hint: t("FILE_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args, context }) {
    const fileRef = context.files.parseFileRef(args.parameters.file)
    const downloaded = await context.files.download(fileRef)

    const base64Content = downloaded.content ?? ""
    const bytes = new Uint8Array(Buffer.from(base64Content, "base64"))

    const { encoding, bomLength } = detectBomEncoding(bytes)
    const contentBytes = bomLength > 0 ? bytes.subarray(bomLength) : bytes

    // biome-ignore lint/suspicious/noExplicitAny: TextDecoder supports broader encodings at runtime than Bun's type definition
    const decoder = new TextDecoder(encoding as any)
    const text = decoder.decode(contentBytes)

    try {
      return JSON.parse(text)
    } catch (err) {
      throw new Error(
        `Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  },
} satisfies ToolDefinition
