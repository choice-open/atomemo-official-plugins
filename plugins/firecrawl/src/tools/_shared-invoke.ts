import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

const ERROR_MESSAGE = "This Firecrawl tool invoke implementation is not available."

export const notImplementedToolInvoke: ToolDefinition["invoke"] = async () => {
  throw new Error(ERROR_MESSAGE)
}
