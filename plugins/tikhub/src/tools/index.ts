import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { xiaohongshuAppV2Tools } from "./xiaohongshu/app-v2"

export const allTools: ToolDefinition[] = [
  ...xiaohongshuAppV2Tools,
]
