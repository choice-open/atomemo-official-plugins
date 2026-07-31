import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_bilibili_search_by_type } from "./fetch-search-by-type"

export const bilibiliAppTools: ToolDefinition[] = [
  tikhub_bilibili_search_by_type,
]
