import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_wechat_search_fetch_search } from "./fetch-search"
import { tikhub_wechat_search_videos } from "./fetch-search-videos"

export const wechatSearchV2Tools: ToolDefinition[] = [
  tikhub_wechat_search_fetch_search,
  tikhub_wechat_search_videos,
]
